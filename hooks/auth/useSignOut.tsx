import { useSWRConfig } from "swr";
import { useDisconnect } from "wagmi";
import useAxios from "../axios/useAxios";

const useSignOut = (props?: { onSignOut?: () => void }) => {
  const { mutate } = useSWRConfig();
  const { send } = useAxios({
    url: process.env.NEXT_PUBLIC_SERVER_BASEURL + "/auth/logout",
    onSettled: () => {
      mutate(`${process.env.NEXT_PUBLIC_SERVER_BASEURL}/auth/me`);
    },
  });
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      send();
    },
  });

  const signOut = async () => {
    disconnect();
  };

  return { signOut };
};

export default useSignOut;
