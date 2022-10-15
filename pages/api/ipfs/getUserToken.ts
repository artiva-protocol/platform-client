import { ArtivaClientConfig } from "configs/artiva-client-config";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const ipfs = ArtivaClientConfig.IPFSAdapter;
  const token = await (await ipfs).generateUserKey();
  res.send({ token });
};

export default handler;
