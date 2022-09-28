import { BigNumberish } from "ethers";
import usePlatformWrite from "hooks/artiva-protocol/contract-writes/usePlatformWrite";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import useSigningKey from "../crypto/useSigningKey";
import { Post } from "@artiva/shared";

export type UsePublishPostType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const usePublishPost = (
  content: Post[],
  contentId?: BigNumberish
): UsePublishPostType => {
  const { address } = useAccount();
  const { signature } = useSigningKey();

  const formattedContent = useMemo(() => {
    if (content.length < 1) return;
    return JSON.stringify(
      content.map((x) => {
        return {
          id: x.id,
          contentJSON: JSON.stringify(x.content),
          type: x.type,
        };
      })
    );
  }, [content]);

  const write = usePlatformWrite(
    contentId ? "setContentWithSig" : "addContentWithSig",
    contentId
      ? [contentId, formattedContent, address, signature]
      : [formattedContent, address, address, signature]
  );

  return {
    save: () => {
      write.write?.();
    },
    loading: write.loading,
    success: write.success,
    error: write.error,
  };
};

export default usePublishPost;
