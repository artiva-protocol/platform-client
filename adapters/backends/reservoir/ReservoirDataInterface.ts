import { NFTInterface } from "@zoralabs/nft-hooks/dist/types";

export type ReservoirAttribute = {
  key: string;
  value: string;
};

export type ReservoirAsset = {
  contract: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  media?: string;
  kind: string;
  collection: {
    id: string;
    name: string;
    image: string;
    slug: string;
  };
  owner: string;
  attributes: ReservoirAttribute[];
};

export type ReservoirResponse = {
  token: ReservoirAsset;
};

export interface ReservoirDataInterface extends NFTInterface<ReservoirAsset> {}
