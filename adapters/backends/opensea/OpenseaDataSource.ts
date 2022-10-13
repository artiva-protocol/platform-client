import DataLoader from "dataloader";
import {
  NFTQuery,
  NFTQueryResult,
} from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { NetworkIDs } from "@zoralabs/nft-hooks";
import { OPENSEA_API_URL_BY_NETWORK } from "@zoralabs/nft-hooks/dist/constants/urls";
import { NFT_ID_SEPERATOR } from "@zoralabs/nft-hooks/dist/constants/shared";
import {
  MEDIA_SOURCES,
  NFTIdentifier,
  NFTObject,
} from "@zoralabs/nft-hooks/dist/types/NFTInterface";
import { OpenseaAsset, OpenseaInterface } from "./OpenseaInterface";
import { getAddress } from "@ethersproject/address";
import { FetchWithTimeout } from "@zoralabs/nft-hooks/dist/fetcher/FetchWithTimeout";

type OpenseaDataResponse = {
  assets: OpenseaAsset[];
};

export class OpenseaDataSource implements OpenseaInterface {
  nftsLoader: DataLoader<string, OpenseaAsset | Error>;
  endpoint: string;
  timeout: number;
  MAX_OPENSEA_SIZE = 50;
  apiKey?: string;
  constructor(networkId: NetworkIDs, apiKey?: string, timeout = 10) {
    this.nftsLoader = new DataLoader(this.fetchNFTsOpensea, {
      maxBatchSize: this.MAX_OPENSEA_SIZE,
    });
    this.endpoint = OPENSEA_API_URL_BY_NETWORK[networkId];
    this.timeout = timeout;
    this.apiKey = apiKey;
  }
  loadNFT = async ({
    contract,
    id,
  }: NFTIdentifier): Promise<OpenseaAsset | Error> => {
    return await this.nftsLoader.load(
      `${getAddress(contract)}${NFT_ID_SEPERATOR}${id}`
    );
  };
  loadNFTs = async (
    nfts: readonly NFTIdentifier[]
  ): Promise<(OpenseaAsset | Error)[]> => {
    return await this.nftsLoader.loadMany(
      nfts.map(
        (nft) => `${getAddress(nft.contract)}${NFT_ID_SEPERATOR}${nft.id}`
      )
    );
  };
  canLoadNFT() {
    return true;
  }
  transformNFT(asset: OpenseaAsset, object?: NFTObject) {
    if (!object) {
      object = { rawData: {} };
    }
    object.nft = {
      tokenId: asset.token_id.toString(),
      contract: {
        address: asset.asset_contract?.address,
        name: asset.asset_contract.name || undefined,
        symbol: asset.asset_contract.symbol || undefined,
        description: asset.asset_contract.description || undefined,
        imageUri: asset.asset_contract.image_url || undefined,
      },
      owner: {
        address: asset.owner?.address,
      },
      metadataURI: asset.token_metadata || undefined,
      contentURI:
        asset.animation_original_url || asset.image_original_url || undefined,
      minted: {
        address: asset.creator?.address,
      },
    };
    object.metadata = {
      name: asset.name || undefined,
      description: asset.description || undefined,
      contentUri: asset.animation_url || undefined,
      imageUri: asset.image_url || undefined,
      attributes: asset.traits.map((trait) => ({
        name: trait.trait_type,
        value: trait.value,
        display: trait.display_type,
      })),
    };
    object.media = {
      thumbnail: asset.image_thumbnail_url
        ? {
            uri: asset.image_thumbnail_url,
          }
        : undefined,
      image:
        asset.image_url || asset.animation_url
          ? {
              uri: asset.animation_url || asset.image_url!,
            }
          : undefined,
      source: MEDIA_SOURCES.OPENSEA,
    };
    if (asset.animation_url) {
      object.content = {
        source: MEDIA_SOURCES.OPENSEA,
        original: asset.animation_url
          ? {
              uri: asset.animation_url || asset.image_original_url!,
            }
          : undefined,
      };
    }
    if (!object.rawData) {
      object.rawData = {};
    }
    object.rawData["OpenSea"] = asset;
    return object;
  }

  fetchNFTsOpensea = async (
    nftAddressesAndTokens: readonly string[]
  ): Promise<(Error | OpenseaAsset)[]> => {
    const urlParams: string[] = [];
    const nftTuples = nftAddressesAndTokens.map((address) =>
      address.toLowerCase().split(NFT_ID_SEPERATOR)
    );
    nftTuples.forEach(([address, tokenId]) => {
      urlParams.push(
        `token_ids=${tokenId}&asset_contract_addresses=${address}`
      );
    });
    const response = await new FetchWithTimeout(this.timeout).fetch(
      `${this.endpoint}assets?${urlParams.join(
        "&"
      )}&order_direction=desc&limit=${this.MAX_OPENSEA_SIZE}`,
      {
        headers: {
          "X-API-KEY": this.apiKey || "2f6f419a083c46de9d83ce3dbe7db601",
        },
      }
    );
    const responseJson = (await response.json()) as OpenseaDataResponse;

    return nftTuples.map(
      ([address, tokenId]: any) =>
        responseJson.assets.find(
          (asset) =>
            asset.token_id === tokenId &&
            asset.asset_contract.address.toLowerCase() === address
        ) || new Error("No asset")
    );
  };

  queryNFTs(_: NFTQuery): Promise<NFTQueryResult> {
    throw new Error("not implemented");
  }
}
