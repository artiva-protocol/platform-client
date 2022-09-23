import { NextApiRequest, NextApiResponse } from "next";
import { getContentByPlatform } from "@/services/platform-graph";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  const address = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS;
  if (!address) return res.send({ posts: [] });

  const graphRes = await getContentByPlatform(address);
  if (graphRes.length === 0) return res.send({ posts: [] });

  const uris = graphRes.map((x) => x.uri);

  const content = await Promise.all(
    uris.map((uri) =>
      axios.get(uri, { timeout: 1000 }).catch((x) => {
        return new Error(`Error getting content: ${x?.message}`);
      })
    )
  ).then((x) =>
    x
      ?.filter((y) => !(y instanceof Error))
      .flatMap((y) => ("data" in y ? y.data.content : undefined))
  );

  return res.send({ posts: content });
};

export default handler;
