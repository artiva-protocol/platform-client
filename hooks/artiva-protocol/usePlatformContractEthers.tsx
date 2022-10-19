import { ethers } from "ethers";
import Platform from "@artiva/v2/dist/artifacts/Platform.sol/Platform.json";
import { useMemo } from "react";
import { useRouter } from "next/router";

const usePlatformContractEthers = (signer: ethers.Signer | undefined) => {
  const {
    query: { platform },
  } = useRouter();
  return useMemo(() => {
    return platform
      ? new ethers.Contract(
          platform as string,
          new ethers.utils.Interface(Platform.abi),
          signer
        )
      : undefined;
  }, [signer, platform]);
};

export default usePlatformContractEthers;
