import { Platform } from "@artiva/shared";
import { useEffect, useState } from "react";
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

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handler = () => {
      setSuccess(false);
    };

    if (write.success) {
      setSuccess(true);
      setTimeout(handler, 3000);
    }
  }, [write.success]);

  return {
    ...write,
    save: () => {
      write.write?.();
    },
    success,
  };
};

export default useSaveMetadata;
