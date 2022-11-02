import CuratorContext from "@/context/CuratorContext";
import NFTFilterContext, {
  NFTFilterSearchType,
  NFTFilterType,
} from "@/context/NFTFilterContext";
import { PostRequest } from "@/hooks/post/useAddContents";
import { PostTypeEnum, useInfiniteTokens } from "@artiva/shared";
import { Fragment } from "react";
import transformZDKNFTResponse from "utils/transformZDKNFTResponse";
import FeedSkeleton from "../FeedSkeleton";
import PostPreview from "../PostPreview";

const parseFilter = (filter: NFTFilterType) => {
  return {
    ownerAddresses:
      filter.searchType === NFTFilterSearchType.OWNED
        ? filter.addresses
        : undefined,
    collectionAddresses:
      filter.searchType === NFTFilterSearchType.COLLECTION
        ? filter.collectionAddresses
        : undefined,
  };
};

const TokensFeed = () => {
  const { filter } = NFTFilterContext.useContainer();
  const { addContent, contains } = CuratorContext.useContainer();

  const { data, loaderElementRef, more } = useInfiniteTokens({
    ...parseFilter(filter),
    limit: 20,
  });

  const isSingle = filter.searchType === NFTFilterSearchType.SINGLE;

  const feed: PostRequest[] | undefined = isSingle
    ? [
        {
          content: {
            chain: "ETHEREUM",
            tokenId: filter.tokenIds?.[0]!,
            contractAddress: filter.collectionAddresses?.[0]!,
          },
          type: PostTypeEnum.NFT,
        },
      ]
    : data
        ?.flat()
        .filter((x) => x)
        .flatMap((x) => transformZDKNFTResponse(x.tokens.map((x) => x.token)));

  return (
    <Fragment>
      <div className="grid grid-cols-3">
        {feed?.map((x, i) => (
          <div key={i} className="h-[60vh]">
            <PostPreview
              post={x}
              onClick={() => {
                addContent(x);
              }}
              selected={contains(x)}
            />
          </div>
        ))}
      </div>
      <div ref={loaderElementRef} />
      {!isSingle && !!more && <FeedSkeleton />}
    </Fragment>
  );
};

export default TokensFeed;
