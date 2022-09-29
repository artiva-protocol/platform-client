import { NextApiRequest, NextApiResponse } from "next";
import { getPostsByPlatform } from "@/services/platform-graph";
import { Post } from "@artiva/shared";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  const address = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS;
  if (!address) return res.send({ posts: [] });

  const rawPosts = await getPostsByPlatform(address);
  if (rawPosts.length === 0) return res.send({ posts: [] });

  const formattedPosts = rawPosts.flatMap((x) => {
    try {
      return {
        id: x.id,
        content: JSON.parse(x.contentJSON),
        type: x.type,
      } as Post;
    } catch (err) {
      console.log("Error parsing post", x.contentJSON, err);
      return [];
    }
  });

  res.send({ posts: formattedPosts });
};

export default handler;
