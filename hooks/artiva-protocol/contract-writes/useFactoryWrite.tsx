import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Factory from "@artiva/v2/dist/artifacts/PlatformFactory.sol/PlatformFactory.json";
import { TransactionReceipt } from "@ethersproject/providers";

const useFactoryWrite = (
  functionName: string,
  args: any[],
  onSettled?: (data: TransactionReceipt | undefined) => void
) => {
  const prep = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_ARTIVA_FACTORY_ADDRESS!,
    abi: Factory.abi,
    functionName,
    args,
  });
  const write = useContractWrite(prep.config as any);
  const tx = useWaitForTransaction({
    hash: write.data?.hash,
    onSettled,
  });

  return {
    loading: tx.isLoading || write.isLoading,
    data: tx.data,
    write: write?.write,
    error: prep.error || write.error || tx.error,
    success: tx.isSuccess,
  };
};

export default useFactoryWrite;
