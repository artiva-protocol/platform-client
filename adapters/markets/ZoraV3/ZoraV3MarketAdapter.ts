import { Provider } from "@ethersproject/abstract-provider";
import { NFTObject } from "@zoralabs/nft-hooks";
import { Signer, ContractTransaction, BigNumberish } from "ethers";
import { ChainIdentifier } from "@artiva/shared";
import IMarketAdapter from "../IMarketAdapter";
import AsksABI from "@zoralabs/v3/dist/artifacts/AsksOmnibus.sol/AsksOmnibus.json";
import { ethers } from "ethers";
import {
  FIXED_PRICE_MARKET_SOURCES,
  MARKET_INFO_STATUSES,
} from "@zoralabs/nft-hooks/dist/types";

export class ZoraV3MarketAdapter implements IMarketAdapter {
  signerOrProvider?: Signer | Provider;

  connect(signerOrProvider: Signer | Provider, _: ChainIdentifier): void {
    this.signerOrProvider = signerOrProvider;
  }

  placeBid(): Promise<ContractTransaction> {
    throw new Error("Method not implemented.");
  }

  fillAsk(nft: NFTObject, finder: BigNumberish): Promise<ContractTransaction> {
    if (!this.signerOrProvider) throw new Error("Not intilized");
    const ask = this.findAsk(nft);
    if (!ask || !ask?.raw.marketAddress || !ask.amount)
      throw new Error("Ask not found");

    const module = new ethers.Contract(
      ask?.raw.marketAddress,
      AsksABI.abi,
      this.signerOrProvider
    );

    const { nft: nftData } = nft;
    if (!nftData) throw new Error("NFT data not found");

    return module.fillAsk(
      nftData.contract.address,
      nftData?.tokenId,
      ask.amount?.amount.raw,
      ask.amount?.address,
      finder as string,
      { value: ask.amount?.amount.raw }
    );
  }

  offer(): Promise<ContractTransaction> {
    throw new Error("Method not implemented.");
  }

  enabled(nft: NFTObject): boolean {
    return !!this.findAsk(nft);
  }

  private findAsk(nft: NFTObject) {
    return nft.markets?.find(
      (x) =>
        x.source === FIXED_PRICE_MARKET_SOURCES.ZORA_ASK_V3 &&
        x.status === MARKET_INFO_STATUSES.ACTIVE
    );
  }
}

export default new ZoraV3MarketAdapter();
