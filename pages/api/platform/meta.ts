import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const metadata = await getPlatformMetadataByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
  );
  return res.send({ platform: metadata });
};

export default handler;
