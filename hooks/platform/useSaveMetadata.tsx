import { Platform } from "@artiva/shared";
import usePlatformWrite from "../artiva-protocol/contract-writes/usePlatformWrite";
import { useAccount } from "wagmi";
import useSigningKey from "../crypto/useSigningKey";

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
  const { address } = useAccount();
  const { signature } = useSigningKey();

  const write = usePlatformWrite("setPlatformMetadataWithSig", [
    JSON.stringify(data),
    address,
    signature,
  ]);

  return {
    save: () => {
      write.write?.();
    },
    loading: write.loading,
    success: write.success,
    error: write.error,
  };
};

export default useSaveMetadata;
