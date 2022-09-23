import { NFTQuery } from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { ReservoirDataInterface } from "../backends/reservoir/ReservoirDataInterface";
import { ReservoirDataSource } from "../backends/reservoir/ReservoirDataSource";
import { NetworkIDs } from "@zoralabs/nft-hooks/dist/constants/networks";
import {
  NFTStrategy,
  ZDKFetchStrategy,
} from "@zoralabs/nft-hooks/dist/strategies";
import { NFTObject, Strategies } from "@zoralabs/nft-hooks";

export class ReservoirStrategy extends NFTStrategy {
  reservoirBackend: ReservoirDataInterface;
  zdkBackend: ZDKFetchStrategy;
  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.zdkBackend = new Strategies.ZDKFetchStrategy(networkId, {
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
    this.reservoirBackend = new ReservoirDataSource(
      networkId,
      process.env.RESERVOIR_API_KEY
    );
  }

  fetchNFT = async (contract: string, id: string) => {
    try {
      const nft = await this.reservoirBackend.loadNFT({ contract, id });
      if (nft instanceof Error) {
        throw nft;
      }
      const asset = this.reservoirBackend.transformNFT(nft);

      console.log("nft", nft);
      return asset;
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
    const res: NFTObject = await this.zdkBackend.fetchNFT(contract, id);
    const tmp = { ...current };
    tmp.markets = res.markets;
    return tmp;
  };

  queryNFTs = async (query: NFTQuery) => {
    return await this.reservoirBackend.queryNFTs(query);
  };
}
