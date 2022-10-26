import NFTFeedContext, {
  NFTFilterSearchType,
} from "@/context/NFTFilterContext";
import { useEffect, useState } from "react";

const CurateAsset = () => {
  const { modifyFilter } = NFTFeedContext.useContainer();
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      modifyFilter({
        collectionAddresses: address ? [address] : [],
        tokenIds: tokenId ? [tokenId] : [],
        searchType: tokenId
          ? NFTFilterSearchType.SINGLE
          : NFTFilterSearchType.COLLECTION,
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address, tokenId]);

  return (
    <div className="p-8 bg-gray-200 w-full">
      <div>Contract Address</div>
      <input
        placeholder="0x04bfb0...7469f9E"
        className="w-full rounded-md p-2 text-xs mt-1 focus:outline-none"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />

      <div className="mt-8">Token ID</div>
      <input
        placeholder="12"
        className="w-full rounded-md p-2 text-xs mt-1 focus:outline-none"
        value={tokenId}
        onChange={(e) => {
          setTokenId(e.target.value);
        }}
      />
    </div>
  );
};

export default CurateAsset;
