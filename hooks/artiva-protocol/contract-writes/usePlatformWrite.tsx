import { useSigner, useWaitForTransaction } from "wagmi";
import { UseContractWriteMutationArgs } from "wagmi/dist/declarations/src/hooks/contracts/useContractWrite";
import { useState, useEffect } from "react";
import usePlatformContractEthers from "../usePlatformContractEthers";

export type UsePlatformWriteType = {
  write: ((overrideConfig?: UseContractWriteMutationArgs) => void) | undefined;
  error: Error | null;
  loading: boolean;
  success: boolean;
};

const usePlatformWrite = (
  functionName: string,
  args: any[],
  onSettled?: () => void
): UsePlatformWriteType => {
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: signer } = useSigner();
  const platform = usePlatformContractEthers(signer || undefined);

  useEffect(() => {
    const handler = () => {
      setSuccess(false);
    };

    if (success) setTimeout(handler, 3000);
  }, [success]);

  const write = async () => {
    try {
      setLoading(true);
      const res = await platform?.[functionName](...args);
      setHash(res.hash);
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  const tx = useWaitForTransaction({
    hash,
    onSettled: (_, error) => {
      setLoading(false);
      if (!error) setSuccess(true);
      onSettled?.();
    },
  });

  return {
    write,
    error: error || tx.error,
    loading,
    success,
  };
};

export default usePlatformWrite;
