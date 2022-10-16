import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { platform } = req.query;
  const metadata = await getPlatformMetadataByPlatform(platform as string);
  return res.send({ platform: metadata });
};

export default handler;
