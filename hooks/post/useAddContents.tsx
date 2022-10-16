import usePlatformWrite from "hooks/artiva-protocol/contract-writes/usePlatformWrite";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { Post } from "@artiva/shared";
import { TAG_SEPARATOR } from "constants/strings";

export type UseAddContentsType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

export type PostRequest = Omit<Post, "id">;

const useAddContents = (content: PostRequest[]): UseAddContentsType => {
  const { address } = useAccount();

  const formattedContent = useMemo(() => {
    return content.map((x) =>
      JSON.stringify({
        contentJSON: JSON.stringify(x.content),
        type: x.type,
        tags:
          x.tags && x.tags.length > 0 ? x.tags.join(TAG_SEPARATOR) : undefined,
      })
    );
  }, [content]);

  const write = usePlatformWrite("addContents", [formattedContent, address]);

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useAddContents;
