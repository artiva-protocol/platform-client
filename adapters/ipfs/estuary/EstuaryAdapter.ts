import { ESTUARY_API_BASEURL, ESTUARY_UPLOADER_BASEURL } from "constants/urls";
import axios from "axios";
import IIPFSAdapter from "../IIPFSAdapter";

export default class EstuaryAdapter implements IIPFSAdapter {
  generateUserKey = async () => {
    const apiKey = process.env.ESTUARY_API_KEY;
    if (!apiKey) return;
    const req = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: `application/json`,
      },
      params: {
        perms: "upload",
        expiry: "24h",
      },
    };

    try {
      const { data } = await axios.post(
        ESTUARY_API_BASEURL + "/user/api-keys",
        null,
        req
      );
      return data.token;
    } catch (err) {
      console.log("Error generating estuary token", err);
    }
  };

  uploadFile = async (
    file: File,
    token: string,
    onFileProgress?: (prog: number) => void
  ): Promise<string> => {
    let data = new FormData();
    data.append("data", file);

    const config = {
      maxBodyLength: 600000000,
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progress: any) => {
        if (onFileProgress) onFileProgress(progress.loaded / progress.total);
      },
    };

    const res = await axios.post(
      ESTUARY_UPLOADER_BASEURL + "/content/add",
      data,
      config
    );

    return `https://ipfs.io/ipfs/${res.data.cid}`;
  };
}
