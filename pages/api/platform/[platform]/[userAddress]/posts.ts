import { getPostsByPlatform } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";
import { Post } from "@artiva/shared";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userAddress, platform } = req.query;
  const rawPosts = await getPostsByPlatform(
    platform as string,
    userAddress as string
  );

  if (rawPosts.length === 0) return res.send({ posts: [] });

  const formattedPosts = rawPosts.map((x) => {
    return {
      id: x.id,
      content: JSON.parse(x.contentJSON),
      type: x.type,
      tags: x.tags.map((x) => x.name),
    } as Post;
  });

  res.send({ posts: formattedPosts });
};

export default handler;
