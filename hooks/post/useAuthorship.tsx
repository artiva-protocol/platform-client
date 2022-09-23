import { useAccount } from "wagmi";
import usePublishingKey from "../crypto/usePublishingKey";
import useSigningKey from "../crypto/useSigningKey";
import { useEffect, useMemo, useState } from "react";

export type AuthorshipType = {
  contributor: string;
  publishingKey: string;
  publishingKeySignature: string;
  signingKeySignature: string;
  signingKeyMessage: string;
  algorithm: {
    name: string;
    hash: string;
  };
};

const useAuthorship = (
  digest: string | undefined
): AuthorshipType | undefined => {
  const { address } = useAccount();
  const signingKey = useSigningKey();
  const { publicKey, instance } = usePublishingKey();
  const [publishingKeySignature, setPublishingKeySignature] = useState<
    string | undefined
  >();

  useEffect(() => {
    const handler = async () => {
      if (!instance || !digest) return;
      setPublishingKeySignature(await instance.signMessage(digest));
    };
    handler();
  }, [instance, digest]);

  return useMemo(() => {
    if (
      !address ||
      !digest ||
      !signingKey.signature ||
      !publicKey ||
      !publishingKeySignature
    )
      return;

    const algorithm = {
      name: "ECDSA",
      hash: "SHA-256",
    };

    return {
      contributor: address,
      publishingKey: publicKey,
      publishingKeySignature,
      signingKeySignature: signingKey.signature,
      signingKeyMessage: signingKey.getMessage(),
      algorithm,
    };
  }, [address, digest, signingKey, publicKey, publishingKeySignature]);
};

export default useAuthorship;
