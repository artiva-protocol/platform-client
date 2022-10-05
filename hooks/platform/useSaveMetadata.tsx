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
}: {
  data: Platform | undefined;
}): UseSaveMetadataType => {
  const write = usePlatformWrite("setPlatformMetadata", [JSON.stringify(data)]);

  return {
    save: () => {
      write.write?.();
    },
    ...write,
  };
};

export default useSaveMetadata;
