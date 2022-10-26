import { NetworkIDs, NFTObject } from "@zoralabs/nft-hooks";
import {
  NFTStrategy,
  ZDKFetchStrategy,
} from "@zoralabs/nft-hooks/dist/strategies";
import { NFTQuery } from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { ReservoirStrategy } from "./ReservoirStrategy";

export class MultiMarket extends NFTStrategy {
  zdk: ZDKFetchStrategy;
  reservoir: ReservoirStrategy;

  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.zdk = new ZDKFetchStrategy(networkId, {
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
    this.reservoir = new ReservoirStrategy(networkId);
  }

  fetchNFT = async (contract: string, id: string) => {
    try {
      const nft = await this.zdk.fetchNFT(contract, id);
      if (nft instanceof Error) {
        throw nft;
      }
      return nft;
    } catch (err) {
      console.log("Error fetching", err);
      throw err;
    }
  };

  hasSecondaryData = () => true;

  fetchSecondaryData = async (
    contract: string,
    id: string,
    current: NFTObject
  ) => {
    const res: NFTObject = await this.reservoir.fetchNFT(contract, id);

    const tmp = { ...current };
    tmp.markets = res.markets;
    return tmp;
  };

  queryNFTs = async (query: NFTQuery) => {
    return await this.zdk.queryNFTs(query);
  };
}
