import { NFTFeedSearchType, NFTFeedFilterType } from "@/context/NFTFeedContext";
import { useNFTMints, useNFTTokens, Post, PostTypeEnum } from "@artiva/shared";

export type CollectionFragment = {
  tokenId: string;
  contract: string;
};

const useZDKRouter = (filter: NFTFeedFilterType, limit: number = 25) => {
  const { data: mints, error: mintsError } = useNFTMints({
    minterAddresses:
      filter.searchType === NFTFeedSearchType.MINTED
        ? filter.addresses
        : undefined,
    after: filter.after,
    limit,
  });

  const { data: tokens, error: tokensError } = useNFTTokens({
    ownerAddresses:
      filter.searchType === NFTFeedSearchType.OWNED
        ? filter.addresses
        : undefined,
    collectionAddresses:
      filter.searchType === NFTFeedSearchType.COLLECTION
        ? filter.collectionAddresses
        : undefined,
    after: filter.after,
    limit,
  });

  const response = tokens?.tokens || mints?.mints;

  const parsedResponse: Post[] | undefined =
    filter.searchType === NFTFeedSearchType.SINGLE
      ? [
          {
            id: `${"ETHEREUM"}:${filter.addresses?.[0]}:${
              filter.tokenIds?.[0]
            }`,
            content: {
              chain: "ETHEREUM",
              tokenId: filter.tokenIds?.[0],
              contractAddress: filter.addresses?.[0],
            },
            type: PostTypeEnum.NFT,
          },
        ]
      : response?.map((x) => ({
          id: `${"ETHEREUM"}:${x.token?.collectionAddress?.toLowerCase()}:${x.token?.tokenId?.toLowerCase()}`,
          content: {
            chain: "ETHEREUM",
            tokenId: x.token?.tokenId!,
            contractAddress: x.token?.collectionAddress!,
          },
          type: PostTypeEnum.NFT,
        }));

  return {
    nfts: parsedResponse,
    page: tokens?.page || mints?.page,
    error: mintsError || tokensError,
  };
};

export default useZDKRouter;
