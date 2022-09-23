import { abi } from "@artiva/v2/dist/artifacts/PlatformFactory.sol/PlatformFactory.json";
import { BigNumberish, BytesLike } from "ethers";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export type PlatformData = {
  platformMetadataDigest: BytesLike;
  publishers: string[];
  metadataManagers: string[];
  initalContent: BytesLike[];
  nonce: BigNumberish;
};

const useFactoryCreate = (data?: PlatformData) => {
  const { config, error } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_ARTIVA_PLATFORM_FACTORY!,
    contractInterface: abi,
    functionName: "create",
    args: [data],
  });
  const contractWrite = useContractWrite(config);
  const tx = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  return {
    write: contractWrite.write,
    error: error || contractWrite.error || tx.error,
    tx,
  };
};

export default useFactoryCreate;
