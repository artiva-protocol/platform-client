import Platform from "@artiva/v2/dist/artifacts/Platform.sol/Platform.json";
import { useMemo } from "react";
import Web3 from "web3";
import usePublishingKey from "../crypto/usePublishingKey";

const usePlatformContractWeb3 = () => {
  const { provider } = usePublishingKey();

  return useMemo(() => {
    if (!provider) return;
    const web3 = new Web3(provider);
    return new web3.eth.Contract(
      Platform.abi as any,
      process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
    );
  }, [provider]);
};

export default usePlatformContractWeb3;
