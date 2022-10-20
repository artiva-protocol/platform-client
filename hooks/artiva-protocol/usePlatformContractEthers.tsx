import { ethers } from "ethers";
import Platform from "@artiva/v2/dist/artifacts/Platform.sol/Platform.json";
import { useMemo } from "react";
import { useRouter } from "next/router";

const usePlatformContractEthers = (signer: ethers.Signer | undefined) => {
  const {
    query: { platform },
  } = useRouter();
  return useMemo(() => {
    if (
      !platform ||
      !(platform as string).startsWith("0x") ||
      platform.length !== 42
    )
      return;
    return new ethers.Contract(
      platform as string,
      new ethers.utils.Interface(Platform.abi),
      signer
    );
  }, [signer, platform]);
};

export default usePlatformContractEthers;
