import DataLoader from "dataloader";
import {
  NFTQuery,
  NFTQueryResult,
} from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { NetworkIDs } from "@zoralabs/nft-hooks";
import { NFT_ID_SEPERATOR } from "@zoralabs/nft-hooks/dist/constants/shared";
import {
  FIXED_PRICE_MARKET_SOURCES,
  FIXED_SIDE_TYPES,
  MARKET_INFO_STATUSES,
  MARKET_TYPES,
  MEDIA_SOURCES,
  NFTIdentifier,
  NFTObject,
} from "@zoralabs/nft-hooks/dist/types/NFTInterface";
import {
  ReservoirResponse,
  ReservoirDataInterface,
} from "./ReservoirDataInterface";
import { getAddress } from "@ethersproject/address";
import { FetchWithTimeout } from "@zoralabs/nft-hooks/dist/fetcher/FetchWithTimeout";
import { RESERVOIR_API_BY_NETWORK } from "constants/urls";

type ReservoirDataResponse = {
  tokens: ReservoirResponse[];
};

export class ReservoirDataSource implements ReservoirDataInterface {
  nftsLoader: DataLoader<string, ReservoirResponse | Error>;
  endpoint: string;
  timeout: number;
  MAX_SIZE = 50;
  apiKey?: string;

  constructor(networkId: NetworkIDs, apiKey?: string, timeout = 10) {
    this.nftsLoader = new DataLoader(this.fetchNFTs, {
      maxBatchSize: this.MAX_SIZE,
    });
    this.endpoint = RESERVOIR_API_BY_NETWORK[networkId];
    this.timeout = timeout;
    this.apiKey = apiKey;
  }

  loadNFT = async ({
    contract,
    id,
  }: NFTIdentifier): Promise<ReservoirResponse | Error> => {
    return await this.nftsLoader.load(
      `${getAddress(contract)}${NFT_ID_SEPERATOR}${id}`
    );
  };

  loadNFTs = async (
    nfts: readonly NFTIdentifier[]
  ): Promise<(ReservoirResponse | Error)[]> => {
    return await this.nftsLoader.loadMany(
      nfts.map(
        (nft) => `${getAddress(nft.contract)}${NFT_ID_SEPERATOR}${nft.id}`
      )
    );
  };

  canLoadNFT() {
    return true;
  }

  transformNFT(data: ReservoirResponse, object?: NFTObject) {
    const { token, market } = data;
    if (!object) {
      object = { rawData: {} };
    }
    object.nft = {
      tokenId: token.tokenId.toString(),
      contract: {
        address: token.contract,
        name: token.collection.name || undefined,
        symbol: token.collection.slug.toUpperCase() || undefined,
        description: undefined,
        imageUri: token.collection.image || undefined,
      },
      owner: {
        address: token.owner,
      },
      metadataURI: undefined,
      contentURI: token.media || token.image || undefined,
      minted: {
        address: undefined,
      },
    };
    object.metadata = {
      name: token.name || undefined,
      description: token.description || undefined,
      contentUri: token.media || undefined,
      imageUri: token.image || undefined,
      attributes: token?.attributes?.map((trait) => ({
        name: trait.key,
        value: trait.value,
      })),
    };
    object.media = {
      thumbnail: undefined,
      image:
        token.image || token.media
          ? {
              uri: token.image || token.media!,
            }
          : undefined,
      source: MEDIA_SOURCES.DERIVED,
    };
    if (token.media) {
      object.content = {
        source: MEDIA_SOURCES.DERIVED,
        original: token.media
          ? {
              uri: token.media || token.image!,
            }
          : undefined,
      };
    }
    if (market) {
      const ask = market.floorAsk;
      object.markets = [
        {
          type: MARKET_TYPES.FIXED_PRICE,
          source: FIXED_PRICE_MARKET_SOURCES.OPENSEA_FIXED,
          side: FIXED_SIDE_TYPES.ASK,
          status: MARKET_INFO_STATUSES.ACTIVE,
          amount: ask.price
            ? {
                amount: {
                  raw: ask.price.amount.raw,
                  value: ask.price.amount.native,
                },
                address: ask.price.currency.contract,
                symbol: ask.price.currency.symbol,
              }
            : undefined,
          createdAt: {
            timestamp: market.floorAsk.validFrom?.toString(),
          },
          expires: market.floorAsk.validUntil?.toString(),
          raw: market,
        },
      ];
    }
    if (!object.rawData) {
      object.rawData = {};
    }
    object.rawData["Reservoir"] = data;
    return object;
  }

  fetchNFTs = async (
    nftAddressesAndTokens: readonly string[]
  ): Promise<(Error | ReservoirResponse)[]> => {
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
      )}&includeAttributes=false&sortBy=tokenId&limit=${this.MAX_SIZE}`,
      {
        headers: {
          "X-API-KEY": this.apiKey,
        },
      }
    );
    const responseJson = (await response.json()) as ReservoirDataResponse;

    return nftTuples.map(
      ([address, tokenId]: any) =>
        responseJson.tokens.find(
          (asset) =>
            asset.token.tokenId === tokenId &&
            asset.token.contract.toLowerCase() === address
        ) || new Error("No asset")
    );
  };

  queryNFTs(_: NFTQuery): Promise<NFTQueryResult> {
    throw new Error("not implemented");
  }
}
