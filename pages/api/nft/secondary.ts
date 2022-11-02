import { getNFTSecondaryData } from "@/services/nft";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nft } = req.body;
  const secondary = await getNFTSecondaryData(nft);
  res.send(secondary);
};

export default handler;
