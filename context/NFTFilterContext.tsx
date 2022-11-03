import { useState } from "react";
import { createContainer } from "unstated-next";
import { AttributeFilter } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { useAccount } from "wagmi";

export enum NFTFilterSearchType {
  MINTED = "minted",
  OWNED = "owned",
  TEXT_SEARCH = "text_search",
  COLLECTION = "collection",
  SINGLE = "single",
}

export type NFTFilterType = {
  searchType: NFTFilterSearchType;
  collectionAddresses?: string[];
  attributeFilters?: AttributeFilter[];
  text?: string;
  addresses?: string[];
  tokenIds?: string[];
};

export type UseNFTFilterType = {
  filter: NFTFilterType;
  modifyFilter: (partialFilter: Partial<NFTFilterType>) => void;
};

const useNFTFilter = (): UseNFTFilterType => {
  const { address } = useAccount();
  const [filter, setFilter] = useState<NFTFilterType>({
    addresses: [address?.toLowerCase() || ""],
    searchType: NFTFilterSearchType.OWNED,
  });

  const modifyFilter = (partialFilter: Partial<NFTFilterType>) => {
    setFilter((x) => ({
      ...x,
      ...partialFilter,
    }));
  };

  return {
    filter,
    modifyFilter,
  };
};

export default createContainer<UseNFTFilterType>(useNFTFilter);
