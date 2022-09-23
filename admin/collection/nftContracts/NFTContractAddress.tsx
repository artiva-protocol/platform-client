import NFTContractContext from "@/context/NFTContractContext";
import { useEffect, useState } from "react";

const NFTContractAddress = () => {
  const { setAddress: setContextAddress } = NFTContractContext.useContainer();
  const [address, setAddress] = useState<string>("");

  const onAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setContextAddress(address);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  return (
    <div className="p-8 bg-gray-200 w-full">
      <div>Contract address</div>
      <input
        className="w-full rounded-md p-2 text-xs mt-1 focus:outline-none"
        value={address}
        onChange={onAddressChange}
      />
    </div>
  );
};

export default NFTContractAddress;
