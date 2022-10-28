import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Platform from "@artiva/v2/dist/artifacts/Platform.sol/Platform.json";
import { useRouter } from "next/router";

export type UsePlatformWriteType = {
  write: ((overrideConfig?: any) => void) | undefined;
  error: Error | null;
  loading: boolean;
  success: boolean;
};

const usePlatformWrite = (
  functionName: string,
  args: any[],
  onSettled?: () => void
): UsePlatformWriteType => {
  const {
    query: { platform },
  } = useRouter();

  const prep = usePrepareContractWrite({
    address: platform as any,
    abi: Platform.abi,
    functionName,
    args,
  });
  const write = useContractWrite(prep.config as any);

  const tx = useWaitForTransaction({
    hash: write.data?.hash,
    onSettled,
  });

  return {
    write: () => {
      write.write?.();
    },
    error: write.error || tx.error,
    loading: tx.isLoading || write.isLoading,
    success: tx.isSuccess,
  };
};

export default usePlatformWrite;
