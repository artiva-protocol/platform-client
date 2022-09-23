import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    console.log("session", req.session.user);
    res.send({ user: req.session.user || null });
  },
  {
    cookieName: "artiva_user",
    password: process.env.ARTIVA_COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
