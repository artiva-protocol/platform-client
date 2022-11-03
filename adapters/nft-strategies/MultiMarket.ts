import { NetworkIDs, NFTObject } from "@zoralabs/nft-hooks";
import {
  NFTStrategy,
  ZDKFetchStrategy,
} from "@zoralabs/nft-hooks/dist/strategies";
import { NFTQuery } from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { RaribleStrategy } from "./RaribleStrategy";
import { ReservoirStrategy } from "./ReservoirStrategy";

export class MultiMarket extends NFTStrategy {
  zdk: ZDKFetchStrategy;
  reservoir: ReservoirStrategy;
  rarible: RaribleStrategy;

  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.zdk = new ZDKFetchStrategy(networkId, {
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
    this.reservoir = new ReservoirStrategy(networkId);
    this.rarible = new RaribleStrategy(networkId);
  }

  fetchNFT = async (contract: string, id: string) => {
    try {
      const nft = await this.rarible.fetchNFT(contract, id);
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
    const res = await Promise.allSettled([
      this.zdk.fetchNFT(contract, id),
      this.reservoir.fetchNFT(contract, id),
    ]);

    const markets = res
      .filter((x) => x.status == "fulfilled" && x.value)
      .map((x) => (x as any).value);

    const tmp = { ...current };
    tmp.markets = markets.map((x) => x.markets).flat();
    return tmp;
  };

  queryNFTs = async (query: NFTQuery) => {
    return await this.zdk.queryNFTs(query);
  };
}
