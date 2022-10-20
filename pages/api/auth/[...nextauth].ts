import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    address: string | undefined;
  }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          console.log("in auth");

          const nextAuthUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL
            ? `https://${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`
            : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : null;

          console.log("nextAuthUrl", { nextAuthUrl });

          if (!nextAuthUrl) {
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;

          console.log("auth", { domain: siwe.domain, nextAuthHost });

          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          console.log("auth", {
            nonce1: siwe.nonce,
            nonce2: await getCsrfToken({ req }),
          });

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          console.log(
            "validate",
            await siwe.validate(credentials?.signature || "")
          );

          await siwe.validate(credentials?.signature || "");
          return {
            id: siwe.address,
          };
        } catch (e) {
          console.log("auth error", e);
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query?.nextauth?.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        session.address = token.sub;
        return session;
      },
    },
  });
}
