import { ethers } from "ethers";
import Platform from "@artiva/v2/dist/artifacts/Platform.sol/Platform.json";
import { useMemo } from "react";

const usePlatformContractEthers = (signer: ethers.Signer | undefined) => {
  return useMemo(() => {
    return new ethers.Contract(
      process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!,
      new ethers.utils.Interface(Platform.abi),
      signer
    );
  }, [signer]);
};

export default usePlatformContractEthers;
