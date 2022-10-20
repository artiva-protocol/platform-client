import { useSession } from "next-auth/react";

export enum USER_ROLES {
  admin = "admin",
  manager = "manger",
  publisher = "publisher",
}

export type User = {
  address?: string;
  role?: USER_ROLES;
};

const useUser = (props?: {
  platform: string;
}): { user: User; status: "loading" | "authenticated" | "unauthenticated" } => {
  const { data, status } = useSession();
  return {
    user: {
      ...data,
    },
    status,
  };
};

export default useUser;
