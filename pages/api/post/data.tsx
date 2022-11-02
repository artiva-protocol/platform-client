import { getPostPrimaryData } from "@/services/post";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { post } = req.body;
  const data = await getPostPrimaryData(post);
  res.send(data);
};

export default handler;
