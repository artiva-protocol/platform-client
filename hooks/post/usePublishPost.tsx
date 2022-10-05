import usePlatformWrite from "hooks/artiva-protocol/contract-writes/usePlatformWrite";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import useSigningKey from "../crypto/useSigningKey";
import { Post, PostTypeEnum } from "@artiva/shared";
import useSWR from "swr";
import { TAG_SEPARATOR } from "constants/strings";

export type UsePublishPostType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

export type RawPostType = {
  id: string;
  contentJSON: string;
  type: PostTypeEnum;
  tags?: string;
};

const usePublishPost = (
  content: Post[],
  merge: boolean = true
): UsePublishPostType => {
  const { address } = useAccount();
  const { signature } = useSigningKey();
  const { data } = useSWR(`/api/platform/user/${address}/latest-bundle`);

  const formattedContent = useMemo(() => {
    if (content.length < 1) return data?.bundle;

    const newContent: RawPostType[] = content.map((x) => ({
      id: x.id,
      contentJSON: JSON.stringify(x.content),
      type: x.type,
      tags:
        x.tags && x.tags.length > 0 ? x.tags.join(TAG_SEPARATOR) : undefined,
    }));

    // If users already has a bundle merge the content
    return merge && data?.bundle
      ? JSON.stringify([...newContent, ...data?.bundle.data])
      : JSON.stringify(newContent);
  }, [content, data?.bundle]);

  console.log("Formatted content", formattedContent);

  const write = usePlatformWrite(
    data?.bundle ? "setContentWithSig" : "addContentWithSig",
    data?.bundle
      ? [data.bundle.id, formattedContent, address, signature]
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
