import { getContentByPlatformAndOwner } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userAddress } = req.query;
  const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!;
  const content = await getContentByPlatformAndOwner(
    platformAddress,
    userAddress as string
  );
  const posts = await Promise.all(
    content.map((x) => axios.get(x.uri).then((x) => x.data))
  );

  res.send({ posts: posts.flatMap((x) => x.content) });
};

export default handler;
