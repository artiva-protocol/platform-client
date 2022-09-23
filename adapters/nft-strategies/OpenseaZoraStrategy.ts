import {
  NFTQuery,
  NFTQueryResult,
} from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { NetworkIDs, NFTObject, Strategies } from "@zoralabs/nft-hooks";
import {
  NFTStrategy,
  ZDKFetchStrategy,
  OpenseaStrategy,
} from "@zoralabs/nft-hooks/dist/strategies";

export class OpenseaZoraStrategy extends NFTStrategy {
  os: OpenseaStrategy;
  zdk: ZDKFetchStrategy;
  hasSecondaryData = () => true;

  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.os = new OpenseaStrategy(networkId);
    this.zdk = new Strategies.ZDKFetchStrategy(networkId, {
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
  }

  queryNFTs(query: NFTQuery): Promise<NFTQueryResult> {
    return this.os.queryNFTs(query);
  }

  fetchNFT = async (contract: string, id: string) => {
    return await this.os.fetchNFT(contract, id);
  };

  fetchSeconaryData = async (
    contract: string,
    tokenId: string,
    current: NFTObject
  ) => {
    const res: NFTObject = await this.zdk.fetchNFT(contract, tokenId);
    const tmp = { ...current };
    tmp.markets = res.markets;
    return tmp;
  };
}
