import { ChainIdentifier } from "@artiva/shared";
import { ZDK } from "@zoralabs/zdk";
import {
  TokenSortKey,
  SortDirection,
} from "@zoralabs/zdk/dist/queries/queries-sdk";
import INFTQueryAdapter, {
  NFTQueryParameters,
  NFTQueryResult,
  NFTQueryTypeEnum,
} from "../INFTQueryAdapter";

class ZDKQueryAdapter implements INFTQueryAdapter {
  zdk: ZDK;

  constructor() {
    this.zdk = new ZDK({ apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY });
  }

  query = (params: NFTQueryParameters) => {
    return params.type === NFTQueryTypeEnum.MINTED
      ? this.mints(params)
      : this.tokens(params);
  };

  mints = ({
    userAddresses,
    pagination,
  }: NFTQueryParameters): Promise<NFTQueryResult> => {
    return this.zdk
      .mints({
        where: { minterAddresses: userAddresses },
        pagination: { after: pagination?.cursor, limit: pagination?.limit },
      })
      .then((x) => ({
        data: x.mints.nodes.map((mint) => ({
          tokenId: mint.token?.tokenId!,
          contractAddress: mint.token?.tokenContract?.collectionAddress!,
          chain: mint.token?.tokenContract?.network as ChainIdentifier,
        })),
        cursor: x.mints.pageInfo.endCursor || undefined,
        more: x.mints.pageInfo.hasNextPage,
      }));
  };

  tokens = ({
    userAddresses,
    collectionAddresses,
    pagination,
  }: NFTQueryParameters) => {
    return this.zdk
      .tokens({
        where: {
          collectionAddresses: collectionAddresses,
          ownerAddresses: userAddresses,
        },
        pagination: {
          limit: pagination?.limit,
          after: pagination?.cursor,
        },
        sort: {
          sortKey: TokenSortKey.Minted,
          sortDirection: SortDirection.Desc,
        },
        includeFullDetails: false,
        includeSalesHistory: false,
      })
      .then((x) => ({
        data: x.tokens.nodes.map((token) => ({
          tokenId: token.token?.tokenId!,
          contractAddress: token.token?.tokenContract?.collectionAddress!,
          chain: token.token?.tokenContract?.network as ChainIdentifier,
        })),
        cursor: x.tokens.pageInfo.endCursor || undefined,
        more: x.tokens.pageInfo.hasNextPage,
      }));
  };
}
