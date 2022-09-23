import DataLoader from "dataloader";
import {
  NFTQuery,
  NFTQueryResult,
} from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { NetworkIDs } from "@zoralabs/nft-hooks";
import { NFT_ID_SEPERATOR } from "@zoralabs/nft-hooks/dist/constants/shared";
import {
  MEDIA_SOURCES,
  NFTIdentifier,
  NFTObject,
} from "@zoralabs/nft-hooks/dist/types/NFTInterface";
import {
  ReservoirResponse,
  ReservoirAsset,
  ReservoirDataInterface,
} from "./ReservoirDataInterface";
import { getAddress } from "@ethersproject/address";
import { FetchWithTimeout } from "@zoralabs/nft-hooks/dist/fetcher/FetchWithTimeout";
import { RESERVOIR_API_BY_NETWORK } from "constants/urls";

type ReservoirDataResponse = {
  tokens: ReservoirResponse[];
};

export class ReservoirDataSource implements ReservoirDataInterface {
  nftsLoader: DataLoader<string, ReservoirAsset | Error>;
  endpoint: string;
  timeout: number;
  MAX_SIZE = 50;
  apiKey?: string;

  constructor(networkId: NetworkIDs, apiKey?: string, timeout = 10) {
    this.nftsLoader = new DataLoader(this.fetchNFTs, {
      maxBatchSize: this.MAX_SIZE,
      batchScheduleFn: (cb: any) => setTimeout(cb, 1300),
    });
    this.endpoint = RESERVOIR_API_BY_NETWORK[networkId];
    this.timeout = timeout;
    this.apiKey = apiKey;
  }
  loadNFT = async ({
    contract,
    id,
  }: NFTIdentifier): Promise<ReservoirAsset | Error> => {
    return await this.nftsLoader.load(
      `${getAddress(contract)}${NFT_ID_SEPERATOR}${id}`
    );
  };
  loadNFTs = async (
    nfts: readonly NFTIdentifier[]
  ): Promise<(ReservoirAsset | Error)[]> => {
    return await this.nftsLoader.loadMany(
      nfts.map(
        (nft) => `${getAddress(nft.contract)}${NFT_ID_SEPERATOR}${nft.id}`
      )
    );
  };
  canLoadNFT() {
    return true;
  }
  transformNFT(asset: ReservoirAsset, object?: NFTObject) {
    if (!object) {
      object = { rawData: {} };
    }
    object.nft = {
      tokenId: asset.tokenId.toString(),
      contract: {
        address: asset.contract,
        name: asset.collection.name || undefined,
        symbol: asset.collection.slug.toUpperCase() || undefined,
        description: undefined,
        imageUri: asset.collection.image || undefined,
      },
      owner: {
        address: asset.owner,
      },
      metadataURI: undefined,
      contentURI: asset.media || asset.image || undefined,
      minted: {
        address: undefined,
      },
    };
    object.metadata = {
      name: asset.name || undefined,
      description: asset.description || undefined,
      contentUri: asset.media || undefined,
      imageUri: asset.image || undefined,
      attributes: asset?.attributes.map((trait) => ({
        name: trait.key,
        value: trait.value,
      })),
    };
    object.media = {
      thumbnail: undefined,
      image:
        asset.image || asset.media
          ? {
              uri: asset.image || asset.media!,
            }
          : undefined,
      source: MEDIA_SOURCES.DERIVED,
    };
    if (asset.media) {
      object.content = {
        source: MEDIA_SOURCES.DERIVED,
        original: asset.media
          ? {
              uri: asset.media || asset.image!,
            }
          : undefined,
      };
    }
    if (!object.rawData) {
      object.rawData = {};
    }
    object.rawData["Reservoir"] = asset;
    return object;
  }

  fetchNFTs = async (
    nftAddressesAndTokens: readonly string[]
  ): Promise<(Error | ReservoirAsset)[]> => {
    const urlParams: string[] = [];
    const nftTuples = nftAddressesAndTokens.map((address) =>
      address.toLowerCase().split(NFT_ID_SEPERATOR)
    );
    nftTuples.forEach(([address, tokenId]) => {
      urlParams.push(`tokens=${address}:${tokenId}`);
    });
    const response = await new FetchWithTimeout(this.timeout).fetch(
      `${this.endpoint}/tokens/v5?${urlParams.join(
        "&"
      )}&includeAttributes=true&sortBy=tokenId&limit=${this.MAX_SIZE}`,
      {
        headers: {
          "X-API-KEY": this.apiKey,
        },
      }
    );
    const responseJson = (await response.json()) as ReservoirDataResponse;

    return nftTuples.map(
      ([address, tokenId]: any) =>
        responseJson.tokens
          .map((x) => x.token)
          .find(
            (asset) =>
              asset.tokenId === tokenId &&
              asset.contract.toLowerCase() === address
          ) || new Error("No asset")
    );
  };

  queryNFTs(_: NFTQuery): Promise<NFTQueryResult> {
    throw new Error("not implemented");
  }
}
