import { Platform } from "@artiva/shared";
import { TransactionReceipt } from "@ethersproject/providers";
import useFactoryWrite from "../artiva-protocol/contract-writes/useFactoryWrite";

export type UseCreatePlatformType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

export enum RoleEnum {
  UNAUTHORIZED = 0,
  PUBLISHER = 1,
  MANAGER = 2,
  ADMIN = 3,
}

export type RoleRequest = {
  account: string;
  role: RoleEnum;
};

const useCreatePlatform = ({
  data,
  roles,
  onSettled,
}: {
  data: Platform | undefined;
  roles: RoleRequest[];
  onSettled?: (data: TransactionReceipt | undefined) => void;
}): UseCreatePlatformType => {
  const write = useFactoryWrite(
    "create",
    [JSON.stringify(data), roles],
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
