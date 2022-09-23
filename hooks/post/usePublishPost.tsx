import base64url from "base64url";
import { BigNumberish } from "ethers";
import usePlatformWrite from "hooks/artiva-protocol/contract-writes/usePlatformWrite";
import useContentUpload from "hooks/content/useContentUpload";
import useAuthorship from "hooks/post/useAuthorship";
import { sha256 } from "js-sha256";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import useSigningKey from "../crypto/useSigningKey";
import { useEffect } from "react";

export type UsePublishPostType = {
  save: () => void;
  loadingUpload: boolean;
  loadingWrite: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const usePublishPost = (
  content: any,
  contentId?: BigNumberish
): UsePublishPostType => {
  const digest = useMemo(() => {
    if (!content) return;
    const hex = sha256(JSON.stringify(content));
    const digestBuffer = Buffer.from(hex, "hex");
    const base64 = base64url.encode(digestBuffer);
    return { hex, base64 };
  }, [content]);

  const { address } = useAccount();
  const { signature } = useSigningKey();

  const version = "artiva-20220801";

  const authorship = useAuthorship(digest?.base64);

  const postContent = {
    authorship,
    content,
    digest: digest?.base64,
    timestamp: Date.now(),
    version,
  };

  const upload = useContentUpload(postContent);

  const write = usePlatformWrite(
    contentId ? "setContentWithSig" : "addContentWithSig",
    contentId
      ? [contentId, upload.contentURI, address, signature]
      : [upload.contentURI, address, address, signature]
  );

  useEffect(() => {
    if (!upload.contentURI || !write.write) return;
    write.write?.();
  }, [upload.contentURI]);

  return {
    save: upload.upload,
    loadingUpload: upload.loading,
    loadingWrite: write.loading,
    success: write.success,
    error: upload.error || write.error,
  };
};

export default usePublishPost;
