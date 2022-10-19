import { getUserRolesByPlatformAndUser } from "@/services/platform-graph";
import { withIronSessionApiRoute } from "iron-session/next";

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
    const { address, platform } = req.body;
    let roles = {};
    if (platform)
      roles = await getUserRolesByPlatformAndUser(platform, address);

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
