import usePublishingKey from "hooks/crypto/usePublishingKey";
import { sha256 } from "js-sha256";
import { useCallback } from "react";
import { useAccount } from "wagmi";

const useAuthDataDynamic = () => {
  const { address } = useAccount();
  const { publicKey, instance } = usePublishingKey();

  const getAuthData = useCallback(
    (data: any) => {
      if (!address || !data || !instance) return;

      const timestamp = Date.now();

      const digest = sha256(`${JSON.stringify(data)} ${timestamp}`);

      return {
        data: data,
        digest: digest,
        key: publicKey,
        signature: instance.signMessage(digest),
        userAddress: address,
        timestamp,
      };
    },
    [address, instance, publicKey]
  );

  return { getAuthData };
};

export default useAuthDataDynamic;
