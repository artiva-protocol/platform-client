import { useState } from "react";
import axios from "axios";
import { ARWEAVE_GATEWAY_URL } from "constants/urls";

export type UseContentUploadType = {
  upload: () => void;
  loading: boolean;
  success: boolean;
  error: Error | undefined;
  contentURI: string | undefined;
};

const useContentUpload = (content: any): UseContentUploadType => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [contentURI, setContentURI] = useState<string | undefined>();

  const upload = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        process.env.NEXT_PUBLIC_SERVER_BASEURL + "/upload/content",
        {
          content,
        }
      );

      if (res.status === 200)
        setContentURI(`${ARWEAVE_GATEWAY_URL}/${res.data.id}`);

      return res;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, success: !!contentURI, error, contentURI };
};

export default useContentUpload;
