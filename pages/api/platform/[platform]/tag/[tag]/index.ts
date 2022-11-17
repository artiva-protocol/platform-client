import { getTagByPlatformAndName } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { platform, tag } = req.query;
  const parsedTag = decodeURIComponent(tag as string);
  const tagData = await getTagByPlatformAndName(platform as string, parsedTag);
  res.send(tagData);
};

export default Handler;
