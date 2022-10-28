import usePlatformWrite from "../artiva-protocol/contract-writes/usePlatformWrite";
import { RoleRequest } from "./useCreatePlatform";

export type UseSetManyRolesType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const useSetManyRoles = ({
  data,
  onSettled,
}: {
  data: RoleRequest[] | undefined;
  onSettled?: () => void;
}): UseSetManyRolesType => {
  const write = usePlatformWrite("setManyRoles", [data], onSettled);

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useSetManyRoles;
