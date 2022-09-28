import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { get, set, del } from "idb-keyval";
import usePublishingKey from "./usePublishingKey";
import { useSignTypedData } from "wagmi";
import { ArtivaProtocolTypedDataConfig } from "configs/artiva-protocol-config";
import { _TypedDataEncoder } from "ethers/lib/utils";

const useSigningKey = () => {
  const { publicKey } = usePublishingKey();
  const { address } = useAccount();
  const { domain, types } = ArtivaProtocolTypedDataConfig;

  const value = {
    message: "I authorize publishing on artiva from this device",
    publishingKey: publicKey,
    nonce: "0",
  };

  const { signTypedData } = useSignTypedData({
    domain,
    types,
    value,
    onSuccess: async (data) => {
      setSignature(data);
      await set(dbKey, data);
    },
    onError: (err) => {
      console.log("Sig error", err);
    },
  });

  const [signature, setSignature] = useState<string | undefined>();
  const dbKey = `signing-key-signature-${address}`;

  const clearSignature = async () => {
    await del(dbKey);
    setSignature(undefined);
  };

  const getMessage = () => {
    return `I authorize publishing on artiva from this device \nusing: ${publicKey} \nplatform: ${process.env.NEXT_PUBLIC_PLATFORM_ADDRESS} \nnonce: 0`;
  };

  useEffect(() => {
    const handler = async () => {
      const sig = await get(dbKey);
      setSignature(sig);
    };
    handler();
  }, [dbKey]);

  return {
    signature,
    generateSignature: signTypedData,
    clearSignature,
    getMessage,
  };
};

export default useSigningKey;
