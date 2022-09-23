import usePublishingKey from "hooks/crypto/usePublishingKey";
import useSigningKey from "hooks/crypto/useSigningKey";
import { useSWRConfig } from "swr";
import { useDisconnect } from "wagmi";
import useAxios from "../axios/useAxios";

const useSignOut = (props?: { onSignOut?: () => void }) => {
  const { mutate } = useSWRConfig();
  const { send } = useAxios({
    url: process.env.NEXT_PUBLIC_SERVER_BASEURL + "/auth/logout",
  });
  const { clearSignature } = useSigningKey();
  const { clearPrivateKey } = usePublishingKey();
  const { disconnectAsync } = useDisconnect();

  const signOut = async () => {
    await send();
    await clearPrivateKey();
    await clearSignature();
    await disconnectAsync();
    mutate(`${process.env.NEXT_PUBLIC_SERVER_BASEURL}/auth/me`);
  };

  return { signOut };
};

export default useSignOut;
