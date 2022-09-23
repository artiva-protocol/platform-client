import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    req.session.destroy();
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
