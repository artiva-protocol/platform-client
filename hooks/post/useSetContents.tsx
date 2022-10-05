import usePlatformWrite from "hooks/artiva-protocol/contract-writes/usePlatformWrite";
import { useMemo } from "react";
import { Post } from "@artiva/shared";
import { TAG_SEPARATOR } from "constants/strings";

export type UseSetContentsType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const useSetContents = (reqs: Post[]): UseSetContentsType => {
  const formattedRequests = useMemo(() => {
    return reqs.map((x) => ({
      contentId: x.id,
      content: JSON.stringify({
        contentJSON: JSON.stringify(x.content),
        type: x.type,
        tags:
          x.tags && x.tags.length > 0 ? x.tags.join(TAG_SEPARATOR) : undefined,
      }),
    }));
  }, [reqs]);

  const write = usePlatformWrite("setContents", [formattedRequests]);

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useSetContents;
