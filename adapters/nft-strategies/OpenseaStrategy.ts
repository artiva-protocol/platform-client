import { NFTQuery } from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { OpenseaInterface } from "../backends/opensea/OpenseaInterface";
import { OpenseaDataSource } from "../backends/opensea/OpenseaDataSource";
import { NetworkIDs } from "@zoralabs/nft-hooks/dist/constants/networks";
import {
  NFTStrategy,
  ZDKFetchStrategy,
} from "@zoralabs/nft-hooks/dist/strategies";
import { NFTObject, Strategies } from "@zoralabs/nft-hooks";

export class OpenseaStrategy extends NFTStrategy {
  openseaBackend: OpenseaInterface;
  zdkBackend: ZDKFetchStrategy;
  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.zdkBackend = new Strategies.ZDKFetchStrategy(networkId, {
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
    this.openseaBackend = new OpenseaDataSource(networkId);
  }

  fetchNFT = async (contract: string, id: string) => {
    const openseaNFT = await this.openseaBackend.loadNFT({ contract, id });
    if (openseaNFT instanceof Error) {
      throw openseaNFT;
    }
    return this.openseaBackend.transformNFT(openseaNFT);
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
    return await this.openseaBackend.queryNFTs(query);
  };
}
