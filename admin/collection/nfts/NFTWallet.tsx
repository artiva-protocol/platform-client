import NFTFeedContext, {
  NFTFilterSearchType,
} from "@/context/NFTFilterContext";
import { useEffect, useState } from "react";
import { useAccount, useEnsName } from "wagmi";

const CurateWallet = () => {
  const { address: walletAddress } = useAccount();
  const [address, setAddress] = useState<string>("");
  const [searchType, setSearchType] = useState(NFTFilterSearchType.OWNED);
  const { data: ensName } = useEnsName({ address: address as any, chainId: 1 });
  const { modifyFilter } = NFTFeedContext.useContainer();

  const onAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    if (walletAddress) setAddress(walletAddress);
  }, []);

  useEffect(() => {
    if (ensName) setAddress(ensName);
  }, [ensName]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      modifyFilter({ addresses: [address], searchType });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address, searchType]);

  return (
    <div className="p-8 bg-gray-200 w-full">
      <div>Selected wallet</div>
      <input
        className="w-full rounded-md p-2 text-xs mt-1 focus:outline-none"
        value={address}
        onChange={onAddressChange}
      />

      <div className="mt-8">Search type</div>
      <select
        className="w-full rounded-md p-2 text-xs mt-1 focus:outline-none"
        onChange={(e) => {
          setSearchType(e.target.value as NFTFilterSearchType);
        }}
      >
        <option value={NFTFilterSearchType.OWNED}>Owns</option>
        <option value={NFTFilterSearchType.MINTED}>Minted</option>
      </select>
    </div>
  );
};

export default CurateWallet;
