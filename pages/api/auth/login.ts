import { verifyEthSig } from "@/services/crypto";
import { getUserRolesByPlatformAndUser } from "@/services/platform-graph";
import { ArtivaProtocolTypedDataConfig } from "configs/artiva-protocol-config";
import { verifyTypedData } from "ethers/lib/utils";
import { withIronSessionApiRoute } from "iron-session/next";
const { domain, types } = ArtivaProtocolTypedDataConfig;

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      address: number;
      platform: string;
      roles: {
        admin?: boolean;
        contentPublisher?: boolean;
        metadataManager?: boolean;
      };
    };
  }
}

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const { address, publicKey, signature } = req.body;

    if (
      !verifyTypedData(
        domain,
        types,
        {
          message: "I authorize publishing on artiva from this device",
          publishingKey: publicKey,
          nonce: "0",
        },
        signature
      )
    )
      return res.status(401).end();

    const platform = process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!;
    const roles = await getUserRolesByPlatformAndUser(platform, address);

    req.session.user = {
      address,
      platform,
      roles,
    };
    await req.session.save();
    res.send({ ok: true });
  },
  {
    cookieName: "artiva_user",
    password: process.env.ARTIVA_COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
