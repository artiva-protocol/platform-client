import { NFTObject } from "@zoralabs/nft-hooks";
import React from "react";
import { AddressView, NFTRenderer, AvatarView } from "@artiva/shared";
import { CheckIcon } from "@heroicons/react/24/solid";

export const NFTPreview = ({
  nft,
  onClick,
  selected,
  renderingContext,
  showDetails = true,
}: {
  nft?: NFTObject;
  onClick?: () => void;
  selected?: boolean;
  renderingContext?: "FULL" | "PREVIEW" | "THUMBNAIL";
  showDetails?: boolean;
}) => {
  return (
    <div className="rounded-md w-full h-full max-h-lg">
      <div className="relative w-full h-full text-left">
        {showDetails && (
          <div className="opacity-0 hover:opacity-100 transition-opacity bg-black/[.6] absolute top-0 left-0 z-30 w-full h-full overflow-none">
            <div className="z-20 text-white absolute top-0 left-0 w-full p-5">
              <h2 className="text-xl font-semibold">{nft?.metadata?.name}</h2>
              <div className="bg-black/[.4] text-white rounded-md text-xs text-center inline-block px-4 py-1 mt-4">
                {nft?.nft?.contract.name}
              </div>
            </div>

            <div className="absolute bottom-5 left-0 w-full text-white">
              {nft?.nft?.minted?.address && (
                <div className="flex pl-5 pt-5 items-center">
                  <AvatarView
                    address={nft?.nft?.minted.address}
                    className="rounded-full w-4 h-4"
                  />
                  <AddressView
                    address={nft?.nft?.minted.address}
                    className="text-sm text-gray-300 ml-2"
                  />
                </div>
              )}
              {onClick && (
                <div className="px-5 mt-4">
                  <button
                    disabled={selected}
                    onClick={onClick}
                    className="bg-white w-full h-10 rounded-md text-black text-center"
                  >
                    {selected ? (
                      <CheckIcon className="h-6 flex items-center w-full justify-around text-gray-700" />
                    ) : (
                      "Curate"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {nft ? (
          <NFTRenderer
            nft={nft}
            renderingContext={renderingContext}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gray-100 w-full h-full rounded-t-md animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default NFTPreview;
