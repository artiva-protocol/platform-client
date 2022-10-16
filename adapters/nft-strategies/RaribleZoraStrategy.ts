import {
  NFTQuery,
  NFTQueryResult,
} from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { NetworkIDs, NFTObject, Strategies } from "@zoralabs/nft-hooks";
import { RaribleStrategy } from "./RaribleStrategy";
import {
  NFTStrategy,
  ZDKFetchStrategy,
} from "@zoralabs/nft-hooks/dist/strategies";

export class RaribleZoraStrategy extends NFTStrategy {
  rarible: RaribleStrategy;
  zdk: ZDKFetchStrategy;
  hasSecondaryData = () => true;

  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.rarible = new RaribleStrategy(networkId);
    this.zdk = new Strategies.ZDKFetchStrategy(networkId, {
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
  }

  queryNFTs(query: NFTQuery): Promise<NFTQueryResult> {
    return this.rarible.queryNFTs(query);
  }

  fetchNFT = async (contract: string, id: string) => {
    return await this.rarible.fetchNFT(contract, id);
  };

  fetchSecondaryData = async (
    contract: string,
    id: string,
    current: NFTObject
  ) => {
    try {
      const res: NFTObject = await this.zdk.fetchNFT(contract, id);
      const clone = { ...current };
      clone.markets = res.markets;
      return clone;
    } catch (err) {
      console.log("Error fetching markets", err);
      throw err;
    }
  };
}
