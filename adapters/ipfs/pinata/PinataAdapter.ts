import { PINATA_API_BASEURL } from "constants/urls";
import axios from "axios";
import IIPFSAdapter from "../IIPFSAdapter";

export default class PinataAdapter implements IIPFSAdapter {
  generateUserKey = async () => {
    const apiKey = process.env.PINATA_API_JWT;
    if (!apiKey) return;

    const config = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: `application/json`,
      },
    };

    const body = {
      keyName: "Artiva user temp key",
      maxUses: 1,
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
          },
        },
      },
    };

    try {
      const { data } = await axios.post(
        PINATA_API_BASEURL + "/users/generateApiKey",
        body,
        config
      );
      return data.JWT;
    } catch (err) {
      console.log("Error generating pinata token", err);
    }
  };

  uploadFile = async (
    file: File,
    token: string,
    onFileProgress?: (prog: number) => void
  ): Promise<string> => {
    let data = new FormData();
    data.append("file", file);

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
      PINATA_API_BASEURL + "/pinning/pinFileToIPFS",
      data,
      config
    );

    return `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
  };
}
