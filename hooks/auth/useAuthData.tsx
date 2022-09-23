import usePublishingKey from "hooks/crypto/usePublishingKey";
import { sha256 } from "js-sha256";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

const useAuthData = (data: any, refreshInterval?: number) => {
  const { address } = useAccount();
  const { publicKey, instance } = usePublishingKey();
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [signature, setSignature] = useState<string | undefined>();

  useEffect(() => {
    const handler = async () => {
      const digest = sha256(`${JSON.stringify(data)} ${timestamp}`);
      setSignature(await instance?.signMessage(digest));
    };

    handler();
  }, [data, timestamp, instance]);

  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(
        () => setTimestamp(Date.now()),
        refreshInterval
      );
      return () => {
        clearInterval(interval);
      };
    }
  }, [refreshInterval]);

  const authData = useMemo(() => {
    if (!address || !data || !instance) return;

    const digest = sha256(`${JSON.stringify(data)} ${timestamp}`);

    return {
      data: data,
      digest: digest,
      key: publicKey,
      signature,
      userAddress: address,
      timestamp,
    };
  }, [address, data, instance, publicKey, timestamp, signature]);

  return { data: authData, loading: !instance };
};

export default useAuthData;
