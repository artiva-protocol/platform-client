import { useState } from "react";
import { createContainer } from "unstated-next";
import { AttributeFilter } from "@zoralabs/zdk/dist/queries/queries-sdk";
import useZDKRouter from "hooks/curator/useZDKRouter";
import { Post } from "@artiva/shared";
import { useAccount } from "wagmi";
import { PostRequest } from "@/hooks/post/useAddContents";

export enum NFTFeedSearchType {
  MINTED = "minted",
  OWNED = "owned",
  TEXT_SEARCH = "text_search",
  COLLECTION = "collection",
  SINGLE = "single",
}

export type NFTFeedFilterType = {
  searchType: NFTFeedSearchType;
  page: number;
  collectionAddresses?: string[];
  attributeFilters?: AttributeFilter[];
  text?: string;
  addresses?: string[];
  tokenIds?: string[];
  after?: string;
};

export type UseNFTFeedType = {
  feed: PostRequest[] | undefined;
  page?: {
    __typename?: "PageInfo" | undefined;
    endCursor?: string | null | undefined;
    hasNextPage: boolean;
    limit: number;
  };
  error: Error | undefined;
  loading: boolean;
  filter: NFTFeedFilterType;
  modifyFilter: (partialFilter: Partial<NFTFeedFilterType>) => void;
  next: () => void;
  prev: () => void;
};

const useNFTFeed = (): UseNFTFeedType => {
  const { address } = useAccount();
  const [filter, setFilter] = useState<NFTFeedFilterType>({
    addresses: [address?.toLowerCase() || ""],
    searchType: NFTFeedSearchType.MINTED,
    page: 0,
    after: undefined,
  });
  const [cursors, setCursors] = useState<string[]>([]);
  const { nfts, page, error } = useZDKRouter(filter);

  const next = () => {
    if (!page || !page.hasNextPage || !page.endCursor) return;

    setCursors((x) => {
      const clone = [...x];
      clone.push(page.endCursor!);
      return clone;
    });

    modifyFilter({ after: page.endCursor, page: filter.page + 1 });
  };

  const prev = () => {
    const page = filter.page - 1;
    if (page < 0) return;

    const after = page !== 0 ? cursors[page - 1] : undefined;
    modifyFilter({ after, page });
  };

  const modifyFilter = (partialFilter: Partial<NFTFeedFilterType>) => {
    setFilter((x) => ({
      ...x,
      ...partialFilter,
    }));
  };

  return {
    feed: nfts,
    page,
    error,
    loading: !nfts && !error,
    filter,
    modifyFilter,
    next,
    prev,
  };
};

export default createContainer<UseNFTFeedType>(useNFTFeed);
