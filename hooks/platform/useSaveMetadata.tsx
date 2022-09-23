import { Platform } from "@artiva/shared";
import useContentUpload from "../content/useContentUpload";
import usePlatformWrite from "../artiva-protocol/contract-writes/usePlatformWrite";
import { useAccount } from "wagmi";
import useSigningKey from "../crypto/useSigningKey";
import { useEffect } from "react";

export type UseSaveMetadataType = {
  save: () => void;
  loadingUpload: boolean;
  loadingWrite: boolean;
  success: boolean;
  error: Error | undefined | null;
};

const useSaveMetadata = ({
  data,
}: {
  data: Platform | undefined;
}): UseSaveMetadataType => {
  const { address } = useAccount();
  const { signature } = useSigningKey();

  const upload = useContentUpload(data);
  const write = usePlatformWrite("setPlatformMetadataURIWithSig", [
    upload.contentURI,
    address,
    signature,
  ]);

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

export default useSaveMetadata;
