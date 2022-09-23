import { GSNConfig } from "@opengsn/provider";
import { wrapSigner } from "@opengsn/provider/dist/WrapContract";
import { useEffect, useState } from "react";
import useAuthDataDynamic from "../auth/useAuthDataDynamic";
import { ethers } from "ethers";
import usePublishingKey from "../crypto/usePublishingKey";

const useGSNSigner = ({ enabled }: { enabled: boolean }) => {
  const { instance } = usePublishingKey();
  const [gsnSigner, setGSNSigner] = useState<ethers.Signer | undefined>();
  const { getAuthData } = useAuthDataDynamic();

  useEffect(() => {
    const config: Partial<GSNConfig> = {
      paymasterAddress: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS,
      loggerConfiguration: { logLevel: "debug" },
      performDryRunViewRelayCall: false,
    };

    const handler = async () => {
      if (!enabled || !instance) return;
      const res = await wrapSigner(instance, config);
      setGSNSigner(res as ethers.Signer);
    };

    handler();
  }, [enabled, instance, getAuthData]);

  return { data: gsnSigner };
};

export default useGSNSigner;
