import { getMetadata } from "@/services/artiva-protocol";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const metadata = await getMetadata();
  return res.send({ platform: metadata });
};

export default handler;
