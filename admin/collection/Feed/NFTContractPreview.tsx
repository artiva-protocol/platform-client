import React from "react";
import { CollectionResponseItem } from "@zoralabs/zdk/dist/types";
import { NFTIdentifier, NFTRenderer, useNFT } from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import { CollectionStatsAggregateQuery } from "@zoralabs/zdk/dist/queries/queries-sdk";

const NFTContractPreview = ({
  collection,
  aggregateStat,
}: {
  collection: CollectionResponseItem;
  aggregateStat: CollectionStatsAggregateQuery;
}) => {
  const identifier: NFTIdentifier = {
    chain: collection?.networkInfo?.network,
    contractAddress: collection?.address,
    tokenId: "1",
  };
  const { data: nft } = useNFT(identifier);

  return (
    <div className="h-[40vh] relative">
      <div className="absolute bg-black/[.4] top-5 right-8 z-30 text-white px-4 py-1 text-xs">
        {collection?.symbol}
      </div>
      <div className="absolute bottom-12 left-8 z-30 text-white text-left">
        <div className="text-4xl font-semibold">{collection?.name}</div>
        <div className="text-gray-300 mt-2">
          {aggregateStat?.aggregateStat?.nftCount} NFTs
        </div>
      </div>
      {nft && <div className="absolute h-full w-full bg-black/[.4] z-20"></div>}

      {nft && (
        <NFTRenderer
          className="absolute h-full object-cover"
          nft={nft as NFTObject}
        />
      )}
    </div>
  );
};

export default NFTContractPreview;
