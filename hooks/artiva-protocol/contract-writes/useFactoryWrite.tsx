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
    addressOrName: process.env.NEXT_PUBLIC_ARTIVA_FACTORY_ADDRESS!,
    contractInterface: Factory.abi,
    functionName,
    args,
  });
  const write = useContractWrite(prep.config);
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
