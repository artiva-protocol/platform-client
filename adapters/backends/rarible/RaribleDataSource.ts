import { NetworkIDs, NFTObject } from "@zoralabs/nft-hooks";
import { RARIBLE_API_BY_NETWORK } from "../../../constants/urls";
import { FetchWithTimeout } from "@zoralabs/nft-hooks/dist/fetcher/FetchWithTimeout";
import {
  MEDIA_SOURCES,
  NFTIdentifier,
} from "@zoralabs/nft-hooks/dist/types/NFTInterface";
import DataLoader from "dataloader";
import { NFTQuery } from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { getAddress } from "ethers/lib/utils";
import { NFT_ID_SEPERATOR } from "@zoralabs/nft-hooks/dist/constants/shared";
import {
  RaribleAsset,
  RaribleCollection,
  RaribleDataInterface,
  RaribleDataResponse,
  RaribleOwnerResponse,
} from "./RaribleDataInterface";
import { RARIBLE_CHAIN_IDENTIFIER_BY_NETWORKID } from "../../../constants/strings";
import { compareAddress } from "../../../utils/compareAddress";

export class RaribleDataSource implements RaribleDataInterface {
  nftsLoader: DataLoader<string, RaribleAsset>;
  networkId: NetworkIDs;
  timeout: number;
  endpoint: string;

  constructor(
    networkId: NetworkIDs,
    timeout: number = 6,
    endpoint: string = RARIBLE_API_BY_NETWORK[networkId]
  ) {
    this.endpoint = endpoint;
    this.nftsLoader = new DataLoader(this.fetchNFTsRarible);
    this.timeout = timeout;
    this.networkId = networkId;
  }

  queryNFTs(_: NFTQuery): any {
    throw new Error("Method not implemented.");
  }

  canLoadNFT() {
    return true;
  }

  private getUserAddress(identifier: string) {
    if (identifier) return identifier.split(":")[1];
    else return;
  }

  transformNFT(asset: RaribleAsset, object: NFTObject) {
    const getImage = () => {
      const images = asset.meta?.content.filter((x) => x["@type"] === "IMAGE");
      const selected = images.find((x) => x.representation === "ORIGINAL");
      return selected;
    };

    const getThumbnail = () => {
      const selected =
        asset.meta?.content.find((x) => x.representation === "PREVIEW") ||
        asset.meta?.content.find((x) => x.representation === "BIG");

      return selected;
    };

    const getContent = () => {
      const nonImages = asset.meta?.content.filter(
        (x) => x["@type"] !== "IMAGE"
      );
      const selected = nonImages.find((x) => x.representation === "ORIGINAL");
      return selected;
    };

    object.nft = {
      tokenId: asset.tokenId,
      contract: {
        name: asset.collectionData?.name,
        address: this.getUserAddress(asset.contract) || "",
        symbol: asset.collectionData?.symbol,
      },
      owner: asset.owners[0]
        ? { address: this.getUserAddress(asset.owners[0].owner)! }
        : undefined,
      minted: {
        address: this.getUserAddress(asset?.creators[0]?.account),
      },
      metadataURI: asset.meta?.raw,
      contentURI: getContent()?.url,
    };
    object.metadata = {
      name: asset.meta?.name,
      description: asset.meta?.description,
      contentUri: getContent()?.url,
      imageUri: getImage()?.url,
      attributes: asset.meta?.attributes.map((x) => ({
        name: x.key,
        value: x.value,
        display: x.format,
      })),
    };
    object.media = {
      content: getContent()
        ? {
            uri: getContent()!.url,
          }
        : undefined,
      thumbnail: getThumbnail()
        ? {
            uri: getThumbnail()!.url,
          }
        : undefined,
      image: getImage()
        ? {
            uri: getImage()!.url,
          }
        : undefined,
      source: MEDIA_SOURCES.DERIVED,
    };
    if (!object.rawData) {
      object.rawData = {};
    }
    object.rawData["derived"] = asset;
    return object;
  }

  loadNFT = async ({ contract, id }: NFTIdentifier) => {
    return await this.nftsLoader.load(
      `${getAddress(contract)}${NFT_ID_SEPERATOR}${id}`
    );
  };

  async loadNFTs(nfts: readonly NFTIdentifier[]) {
    return await this.nftsLoader.loadMany(
      nfts.map(
        (nft) => `${getAddress(nft.contract)}${NFT_ID_SEPERATOR}${nft.id}`
      )
    );
  }

  async fetchMetadataRarible(ids: string[]) {
    return new FetchWithTimeout(this.timeout).fetch(
      `${this.endpoint}/items/byIds`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ ids }),
      }
    );
  }

  async fetchOwnersRarible(ids: string[]) {
    return Promise.all(
      ids.map((x) => {
        return new FetchWithTimeout(this.timeout).fetch(
          `${this.endpoint}/ownerships/byItem?itemId=${x}`
        );
      })
    );
  }

  async fetchCollectionRarible(collections: string[]) {
    return Promise.all(
      collections.map((x) => {
        return new FetchWithTimeout(this.timeout).fetch(
          `${this.endpoint}/collections/${x}`
        );
      })
    );
  }

  fetchNFTsRarible = async (
    nftAddressesAndTokens: readonly string[]
  ): Promise<(Error | RaribleAsset)[]> => {
    const ids: string[] = [];
    const collectionIds = new Set<string>();
    const nftTuples = nftAddressesAndTokens.map((address) =>
      address.toLowerCase().split(NFT_ID_SEPERATOR)
    );
    nftTuples.forEach(([address, tokenId]) => {
      collectionIds.add(
        `${RARIBLE_CHAIN_IDENTIFIER_BY_NETWORKID[this.networkId]}:${address}`
      );
      ids.push(
        `${
          RARIBLE_CHAIN_IDENTIFIER_BY_NETWORKID[this.networkId]
        }:${address}:${tokenId}`
      );
    });
    const promiseGroup = [];

    promiseGroup.push(this.fetchMetadataRarible(ids));
    promiseGroup.push(this.fetchOwnersRarible(ids));
    promiseGroup.push(this.fetchCollectionRarible(Array.from(collectionIds)));

    const res = (await Promise.all(promiseGroup)) as any;

    const responseJson = (await res[0].json()) as RaribleDataResponse;

    const ownerships = (await Promise.all(
      res[1].map((x: any) => x.json())
    )) as RaribleOwnerResponse[];

    const collections = (await Promise.all(
      res[2].map((x: any) => x.json())
    )) as RaribleCollection[];

    return nftTuples.map(([address, tokenId]: any) => {
      const metadata = responseJson.items.find(
        (asset) =>
          asset.tokenId === tokenId &&
          this.getUserAddress(asset.contract)?.toLowerCase() === address
      );
      const ownerRes = ownerships.find(
        (x) =>
          x.ownerships[0].tokenId === tokenId &&
          this.getUserAddress(x.ownerships[0].contract)?.toLowerCase() ===
            address
      );
      if (metadata && ownerRes) metadata.owners = ownerRes.ownerships;

      const collectionRes = collections.find((x) =>
        compareAddress(this.getUserAddress(x.id) || "", address)
      );
      if (metadata && collectionRes) {
        metadata.collectionData = collectionRes;
      }

      return metadata || new Error("No asset");
    });
  };
}
