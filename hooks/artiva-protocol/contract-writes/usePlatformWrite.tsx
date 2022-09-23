import { useWaitForTransaction } from "wagmi";
import { UseContractWriteMutationArgs } from "wagmi/dist/declarations/src/hooks/contracts/useContractWrite";
import { useState, useEffect } from "react";
//import usePlatformContractEthers from "../usePlatformContractEthers";
import usePublishingKey from "@/hooks/crypto/usePublishingKey";
import usePlatformContractWeb3 from "../usePlatformContractWeb3";

export type UsePlatformWriteType = {
  write: ((overrideConfig?: UseContractWriteMutationArgs) => void) | undefined;
  error: Error | null;
  loading: boolean;
  success: boolean;
};

const usePlatformWrite = (
  functionName: string,
  args: any[]
): UsePlatformWriteType => {
  //const isMeta = !!process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS;
  const { publicKey } = usePublishingKey();
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  //const platform = usePlatformContractEthers(signer);
  const platform = usePlatformContractWeb3();

  useEffect(() => {
    const handler = () => {
      setSuccess(false);
    };

    if (success) setTimeout(handler, 3000);
  }, [success]);

  const write = async () => {
    try {
      setLoading(true);
      //const res = await platform[functionName](...args, { from: publicKey });
      //setHash(res.hash);

      const res = await platform?.methods[functionName](...args).send({
        from: publicKey,
        gas: 999999,
      });
      setHash(res.actualTransactionHash);
    } catch (err: any) {
      console.log("Error writing to platform", err);
      setError(err);
      setLoading(false);
    }
  };

  const tx = useWaitForTransaction({
    hash,
    onSettled: (_, error) => {
      setLoading(false);
      if (!error) setSuccess(true);
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
