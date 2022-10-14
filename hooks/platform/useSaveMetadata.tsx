import { Platform } from "@artiva/shared";
import usePlatformWrite from "../artiva-protocol/contract-writes/usePlatformWrite";

export type UseSaveMetadataType = {
  save: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const useSaveMetadata = ({
  data,
  onSettled,
}: {
  data: Platform | undefined;
  onSettled?: () => void;
}): UseSaveMetadataType => {
  const write = usePlatformWrite(
    "setPlatformMetadata",
    [JSON.stringify(data)],
    onSettled
  );

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useSaveMetadata;
