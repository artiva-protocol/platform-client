import { getUsersByPlatformWithRole } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { platform } = req.query;
  const users = await getUsersByPlatformWithRole(platform as string);
  res.send(users);
};

export default handler;
