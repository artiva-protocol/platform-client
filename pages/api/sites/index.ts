import { NextApiRequest, NextApiResponse } from "next";
import prisma from "utils/primsa";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { subdomain } = req.query;
  const site = await prisma.site.findFirst({
    where: {
      subdomain: subdomain as string,
    },
  });
  res.send(site);
};

export default handler;
