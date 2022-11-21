import { getPostByPlatformAndId } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { platform, postid } = req.query;
  const post = await getPostByPlatformAndId(
    platform as string,
    postid as string
  );

  if (!post) return res.status(404);
  return res.send(post);
};

export default handler;
