import { getBundlesByOwnerAndPlatform } from "@/services/platform-graph";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userAddress } = req.query;
  const platformAddress = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!;
  const bundles = await getBundlesByOwnerAndPlatform(
    platformAddress,
    userAddress as string
  );

  if (bundles.length === 0) return res.send({ bundle: null });

  const primaryBundle = bundles[0];

  res.send({
    bundle: {
      id: primaryBundle.bundleId,
      data: JSON.parse(primaryBundle.bundleJSON),
    },
  });
};

export default handler;
