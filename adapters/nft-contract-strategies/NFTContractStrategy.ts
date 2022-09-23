import { NetworkIDs } from "@zoralabs/nft-hooks";
import { NFTContractObject } from "@artiva/shared";

export type ContractFetchInfo = { address: string };

export abstract class NFTContractStrategy {
  public networkId: string;

  constructor(networkId: NetworkIDs) {
    this.networkId = networkId;
  }

  abstract fetchNFTContract(contract: string): Promise<NFTContractObject>;
  // By default don't query secondary data endpoint.
  hasSecondaryData = (_: ContractFetchInfo) => false;

  async fetchSecondaryData(
    address: string,
    _?: NFTContractObject
  ): Promise<NFTContractObject> {
    return {
      rawData: {},
      collection: {
        address,
      },
    };
  }
}
