import { ethers, Transaction } from "ethers";
import IPublisherAdapter from "../IPublisherAdapter";
import MerklePublisherABI from "@artiva/v2/dist/artifacts/MerklePublisher.sol/MerklePublisher.json";
import axios from "axios";
import { compareAddress } from "../../../utils/compareAddress";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { ARWEAVE_GRAPHQL_URL } from "../../../constants/urls";

export default class MerklePublisher implements IPublisherAdapter {
  public contract?: ethers.Contract;
  private _leaves?: string[];

  public connect(
    addressOrName: string,
    signerOrProvider: ethers.Signer | ethers.providers.Provider
  ) {
    this.contract = new ethers.Contract(
      addressOrName,
      MerklePublisherABI.abi,
      signerOrProvider
    );
  }

  public async initilize(
    platformAddress: string,
    leaves: string[]
  ): Promise<Transaction> {
    if (!this.contract) throw new Error("Not connencted");
    const root = this.generateRoot(leaves);
    const leavesURI = this.uploadLeaves(leaves);
    return await this.contract.setMerkleRoot(platformAddress, root, leavesURI);
  }

  public async canPublish(
    platformAddress: string,
    userAddress: string
  ): Promise<boolean> {
    if (!this.contract) throw new Error("Not connencted");
    const leavesURI = await this.contract.platformToLeavesURI(platformAddress);
    const leaves = await this.getLeaves(leavesURI);
    return !!leaves.find((x) => compareAddress(x, userAddress));
  }

  public async publish(
    platformAddress: string,
    contentURI: string
  ): Promise<Transaction> {
    if (!this.contract) throw new Error("Not connencted");
    const leaves = await this.getLeaves(platformAddress);
    const address = await this.contract.signer.getAddress();
    const proof = await this.generateProof(leaves, address);
    return await this.contract.publish(platformAddress, proof, contentURI);
  }

  private async getLeaves(platformAddress: string) {
    if (this._leaves) return this._leaves;
    if (!this.contract) throw new Error("Not connencted");

    const leavesURI = await this.contract.platformToLeavesURI(platformAddress);
    const { data: leaves } = await axios.get<string[]>(leavesURI);

    this._leaves = leaves;
    return leaves;
  }

  private async uploadLeaves(leaves: string[]) {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_SERVER_BASEURL + "/upload/content",
      {
        leaves,
      }
    );

    if (res.status !== 200)
      throw new Error("Error uploading leaves to arweave");

    this._leaves = leaves;
    return `${ARWEAVE_GRAPHQL_URL}/${res.data.id}`;
  }

  private generateRoot(values: string[]) {
    const leaves = values.map((x) => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    return tree.getRoot().toString("hex");
  }

  private generateProof(values: string[], leaf: string) {
    const leaves = values.map((x) => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const proof = tree.getHexProof(keccak256(leaf));
    return proof;
  }
}
