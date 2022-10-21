import React, { Fragment } from "react";
import {
  ChainIdentifier,
  NFTContractObject,
  NFTIdentifier,
  NFTRenderer,
  useNFT,
} from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";

const NFTContractPreview = ({
  nftContract,
  renderingContext = "PREVIEW",
  showDetails = true,
}: {
  nftContract?: NFTContractObject;
  renderingContext?: "FULL" | "PREVIEW" | "THUMBNAIL";
  showDetails?: boolean;
}) => {
  const identifier: NFTIdentifier | undefined = nftContract
    ? {
        chain: nftContract.collection?.networkInfo?.network as ChainIdentifier,
        contractAddress: nftContract.collection?.address,
        tokenId: "1",
      }
    : undefined;
  const { data: nft } = useNFT(identifier);

  return (
    <div className="h-full max-h-lg relative">
      {showDetails && (
        <Fragment>
          <div className="absolute bg-black/[.4] top-5 right-8 z-30 text-white px-4 py-1 text-xs">
            {nftContract?.collection?.symbol}
          </div>
          <div className="absolute bottom-12 left-8 z-30 text-white text-left">
            <div className="text-4xl font-semibold">
              {nftContract?.collection?.name}
            </div>
            <div className="text-gray-300 mt-2">
              {nftContract?.aggregateStat?.nftCount} NFTs
            </div>
          </div>
          {nft && (
            <div className="absolute h-full w-full bg-black/[.4] z-20"></div>
          )}
        </Fragment>
      )}

      {nft && (
        <NFTRenderer
          className="absolute h-full w-full object-cover"
          nft={nft as NFTObject}
          renderingContext={renderingContext}
        />
      )}
    </div>
  );
};

export default NFTContractPreview;
