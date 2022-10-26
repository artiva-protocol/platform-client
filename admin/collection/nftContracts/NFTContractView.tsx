import React, { Fragment, useMemo } from "react";
import NFTPreview from "../Feed/NFTPreview";
import { NFTObject } from "@zoralabs/nft-hooks";
import {
  ChainIdentifier,
  NFTIdentifier,
  useNFT,
  useNFTTokens,
  PostTypeEnum,
  NFTContractObject,
} from "@artiva/shared";
import CuratorContext from "@/context/CuratorContext";
import { CheckIcon } from "@heroicons/react/24/solid";

const NFTContractView = ({ contract }: { contract: NFTContractObject }) => {
  const { addContent, collection: curateCollection } =
    CuratorContext.useContainer();

  const { data } = useNFTTokens({
    collectionAddresses: contract?.collection?.address
      ? [contract?.collection?.address]
      : undefined,
    limit: 21,
  });

  const nfts = data?.flatMap((x) => x.tokens);

  const selected = useMemo(() => {
    if (!curateCollection || !contract?.collection?.address) return false;
    return !!curateCollection.find(
      (x) =>
        JSON.stringify(x.content) ===
        JSON.stringify({
          chain: "ETHEREUM",
          contractAddress: contract?.collection?.address,
        })
    );
  }, [curateCollection, contract?.collection?.address]);

  if (!contract) return <Fragment />;

  const { collection, aggregateStat } = contract;

  const nftsComponent = () => {
    return nfts?.map((x: any, i: number) => (
      <NFTPreviewWrapper
        key={i}
        identifier={{
          contractAddress: collection?.address,
          tokenId: x.token.tokenId,
          chain: collection?.networkInfo?.network as ChainIdentifier,
        }}
      />
    ));
  };

  const onClick = () => {
    addContent({
      content: {
        chain: "ETHEREUM",
        contractAddress: collection.address,
      },
      type: PostTypeEnum.NFT_CONTRACT,
    });
  };

  return (
    <div className="relative">
      <div className="mt-10 ml-10">
        <div className="text-gray-400 text-xs rounded-md">
          {collection?.symbol}
        </div>
        <div className="text-black text-left mt-4">
          <div className="text-4xl font-light">{collection?.name}</div>
          <div className="flex items-center mt-4">
            <button
              disabled={selected}
              onClick={onClick}
              className="bg-black text-white w-32 w-full h-10 rounded-full text-center mr-4"
            >
              {selected ? (
                <CheckIcon className="h-6 w-full flex items-center w-full justify-around text-gray-200" />
              ) : (
                "Curate"
              )}
            </button>
            <div className="text-lg text-sm border border-gray-400 text-gray-400 px-4 py-1 inline-block rounded-full">
              {collection?.address
                ? collection.address.slice(0, 6) +
                  "..." +
                  collection.address.slice(collection.address.length - 6)
                : undefined}
            </div>
          </div>
        </div>
      </div>
      <div className="text-gray-400 mt-12 flex border-b pb-2 pl-10">
        <div className="mr-6">{aggregateStat?.nftCount} NFTs</div>
        <div className="">{aggregateStat?.ownerCount} Owners</div>
      </div>
      <div className="grid gap-6 grid-cols-3 mx-6 mt-6">{nftsComponent()}</div>
    </div>
  );
};

const NFTPreviewWrapper = ({ identifier }: { identifier: NFTIdentifier }) => {
  const { data: nft } = useNFT(identifier);

  return <NFTPreview nft={nft as NFTObject} />;
};

export default NFTContractView;
