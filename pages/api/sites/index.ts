import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const primsa = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subdomain } = req.query;
  const site = await primsa.site.findFirst({
    where: {
      subdomain: subdomain as string,
    },
  });
  res.send(site);
};

export default handler;
