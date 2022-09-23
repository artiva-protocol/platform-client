import bundlr from "@/services/bundlr";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end();

  const content: any = req.body.content;
  const contentBuffer = Buffer.from(JSON.stringify(content));
  const tags = [
    { name: "App-Name", value: "Artiva" },
    {
      name: "Content-Type",
      value: "application/json",
    },
  ];
  const bundlrRes = await bundlr.upload(contentBuffer, tags);
  return res.status(200).send(bundlrRes);
};

export default handler;
