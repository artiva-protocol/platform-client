import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const primsa = new PrismaClient();

const getDeployment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { platform } = req.query;

  const result = await primsa.site.findFirst({
    where: { contract: platform as string },
  });

  return res.send(result);
};

const upsertDeployment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { platform } = req.query;
  const { subdomain } = req.body;

  const result = await primsa.site.upsert({
    where: { contract: platform as string },
    update: { subdomain },
    create: { subdomain, contract: platform as string },
  });

  return res.send(result);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getDeployment(req, res);
    case "POST":
      return upsertDeployment(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
