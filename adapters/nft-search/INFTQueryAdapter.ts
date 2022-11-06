import { NFTIdentifier } from "@artiva/shared";

export enum NFTQueryTypeEnum {
  MINTED,
  OWNS,
}

export type NFTQueryPagination = {
  limit?: number;
  cursor?: string;
};

export type NFTQueryParameters = {
  collectionAddresses: string[];
  userAddresses: string[];
  type: NFTQueryTypeEnum;
  pagination: NFTQueryPagination;
};

export type NFTQueryResult = {
  data: NFTIdentifier[];
  more: boolean;
  cursor?: string;
};

export default interface INFTQueryAdapter {
  query(params: NFTQueryParameters): Promise<NFTQueryResult>;
}
