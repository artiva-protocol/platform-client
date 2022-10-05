import { getPostsByPlatformAndOwner } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";
import { Post } from "@artiva/shared";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userAddress } = req.query;
  const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!;
  const rawPosts = await getPostsByPlatformAndOwner(
    platformAddress,
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
