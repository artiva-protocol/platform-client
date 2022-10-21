import { NextApiRequest, NextApiResponse } from "next";
import { getPostsByPlatform } from "@/services/platform-graph";
import { Post } from "@artiva/shared";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();
  const { tag, platform, limit, owner, page } = req.query;

  const rawPosts = await getPostsByPlatform(
    platform as string,
    owner as string | undefined,
    tag as string | undefined,
    limit ? parseInt(limit as string) : undefined,
    page ? parseInt(page as string) : undefined
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
