import CuratorContext from "@/context/CuratorContext";
import NFTFilterContext, {
  NFTFilterSearchType,
  NFTFilterType,
} from "@/context/NFTFilterContext";
import { PostRequest } from "@/hooks/post/useAddContents";
import { useInfiniteMints } from "@artiva/shared";
import { Fragment } from "react";
import transformZDKNFTResponse from "utils/transformZDKNFTResponse";
import FeedSkeleton from "../FeedSkeleton";
import PostPreview from "../PostPreview";

const parseFilter = (filter: NFTFilterType) => {
  return {
    minterAddresses:
      filter.searchType === NFTFilterSearchType.MINTED
        ? filter.addresses
        : undefined,
  };
};

const MintsFeed = () => {
  const { filter } = NFTFilterContext.useContainer();
  const { addContent, contains } = CuratorContext.useContainer();

  const { data, loaderElementRef, more } = useInfiniteMints({
    ...parseFilter(filter),
    limit: 20,
  });

  const feed: PostRequest[] | undefined = data
    ?.flat()
    .filter((x) => x)
    .flatMap((x) => transformZDKNFTResponse(x.mints.map((x) => x.mint)));

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
      {!!more && <FeedSkeleton />}
    </Fragment>
  );
};

export default MintsFeed;
