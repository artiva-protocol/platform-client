import { Platform } from "@artiva/shared";
import { TransactionReceipt } from "@ethersproject/providers";
import useFactoryWrite from "../artiva-protocol/contract-writes/useFactoryWrite";

export type UseCreatePlatformType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const useCreatePlatform = ({
  data,
  onSettled,
}: {
  data: Platform | undefined;
  onSettled?: (data: TransactionReceipt | undefined) => void;
}): UseCreatePlatformType => {
  const write = useFactoryWrite(
    "create",
    [JSON.stringify(data), [], []],
    onSettled
  );

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useCreatePlatform;
