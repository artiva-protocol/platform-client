import { NetworkIDs } from "@zoralabs/nft-hooks";
import { NFTStrategy } from "@zoralabs/nft-hooks/dist/strategies/NFTStrategy";
import {
  NFTQuery,
  NFTQueryResult,
} from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { RaribleDataSource } from "../backends/rarible/RaribleDataSource";

export class RaribleStrategy extends NFTStrategy {
  raribleDataSource: RaribleDataSource;
  hasSecondaryData = () => false;

  constructor(networkId: NetworkIDs, timeout?: number) {
    super(networkId);
    this.raribleDataSource = new RaribleDataSource(networkId, timeout);
  }

  queryNFTs(_: NFTQuery): Promise<NFTQueryResult> {
    throw new Error("not implemented");
  }

  fetchNFT = async (contract: string, id: string) => {
    const response = await this.raribleDataSource.loadNFT({ contract, id });
    if (response instanceof Error) {
      throw response;
    }

    return this.raribleDataSource.transformNFT(response, {} as any);
  };
}
