import axios from "axios";
import useSWR from "swr";

export type UserResponse = {
  user: {
    address: number;
    platform: string;
    roles: {
      admin?: boolean;
      contentPublisher?: boolean;
      metadataManager?: boolean;
    };
  } | null;
};

const useAuth = () => {
  return useSWR<UserResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_BASEURL}/auth/me`,
    (url) => axios.get(url).then((x) => x.data)
  );
};

export default useAuth;
