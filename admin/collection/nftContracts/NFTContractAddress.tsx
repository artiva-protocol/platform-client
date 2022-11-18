import NFTContractContext from "@/context/NFTContractContext";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const NFTContractAddress = () => {
  const { setAddress: setContextAddress } = NFTContractContext.useContainer();
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState("");

  const onAddressChange = (e: any) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!address) return;
      if (!ethers.utils.isAddress(address)) {
        setError("Error: invalid address");
        return;
      }

      setError("");

      setContextAddress(address);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  return (
    <div className="p-8 bg-gray-200 w-full">
      <div>Contract address</div>
      <input
        className="w-full rounded-md p-2 text-xs mt-1 focus:outline-none"
        placeholder="0x765F924..."
        value={address}
        onChange={onAddressChange}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default NFTContractAddress;
