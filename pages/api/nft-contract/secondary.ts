import { getNFTContractSecondaryData } from "@/services/nft-contract";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { contract } = req.body;
  const secondary = await getNFTContractSecondaryData(contract);
  res.send(secondary);
};

export default handler;
