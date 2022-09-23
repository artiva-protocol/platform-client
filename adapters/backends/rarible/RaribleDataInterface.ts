import { NFTInterface } from "@zoralabs/nft-hooks/dist/types/NFTInterface";

export type RaribleCreator = {
  account: string;
  value: number;
};

export type RaribleAttributes = {
  key: string;
  value: string;
  type: string;
  format: string;
};

export type RaribleContent = {
  "@type": string;
  url: string;
  representation: string;
  mimeType: string;
  size: number;
};

export type RaribleMeta = {
  name: string;
  description: string;
  attributes: RaribleAttributes[];
  content: RaribleContent[];
  raw: string;
};

export type RaribleAsset = {
  id: string;
  blockchain: string;
  collection: string;
  collectionData: RaribleCollection;
  contract: string;
  tokenId: string;
  creators: RaribleCreator[];
  owners: RaribleOwner[];
  mintedAt: string;
  meta: RaribleMeta;
};

export type RaribleOwner = {
  id: string;
  contract: string;
  tokenId: string;
  owner: string;
};

export type RaribleCollection = {
  id: string;
  name: string;
  symbol: string;
};

export type RaribleDataResponse = {
  items: RaribleAsset[];
};

export type RaribleOwnerResponse = {
  ownerships: RaribleOwner[];
};

export interface RaribleDataInterface extends NFTInterface<RaribleAsset> {}
