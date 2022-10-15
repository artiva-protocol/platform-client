import { ArtivaClientConfig } from "configs/artiva-client-config";
import { useState } from "react";
import useSWR from "swr";

const useIPFSUpload = (props?: {
  file?: File;
  onFileProgress?: (prog: number) => void;
  onUploadComplete?: (data: string) => void;
}) => {
  const { data: token } = useSWR("/api/ipfs/getUserToken");
  const [data, setData] = useState<string | undefined>();

  const upload = async (file?: File) => {
    try {
      if (!token || (!file && !props?.file)) return;
      const ipfs = ArtivaClientConfig.IPFSAdapter;
      const res = await (
        await ipfs
      ).uploadFile(file || props?.file!, token.token, props?.onFileProgress);
      setData(res);
      props?.onUploadComplete?.(res);
      return res;
    } catch (err: any) {
      console.log("Error uploading to IPFS", err);
    }
  };

  return { upload, data };
};

export default useIPFSUpload;
