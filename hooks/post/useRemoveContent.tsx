import usePlatformWrite from "hooks/artiva-protocol/contract-writes/usePlatformWrite";

export type UseRemoveContentType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const useRemoveContent = (contentId: string): UseRemoveContentType => {
  const write = usePlatformWrite("removeContent", [contentId]);

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useRemoveContent;
