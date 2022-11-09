import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|images|examples|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host")!;

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`, "")
          .replace(`.platformize.vercel.app`, "")
      : hostname.replace(`.localhost:3000`, "");

  // rewrites for app pages
  if (currentHost == "app") {
    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (hostname === "localhost:3000" || hostname === "platformize.vercel.app") {
    url.pathname = `/home${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  //Check if host is already the contract name
  let contract =
    currentHost.startsWith("0x") && currentHost.length == 42
      ? currentHost
      : req.cookies.get(currentHost);

  if (!contract) {
    const redirectTo = url.pathname;
    url.pathname = `/_platforms/${currentHost}/_generate`;
    const response = NextResponse.rewrite(url);
    response.cookies.set(`${currentHost}:redirectTo`, redirectTo);
    return response;
  }

  // rewrite everything else to `/_platforms/[platform] dynamic route
  url.pathname = `/_platforms/${contract.toLowerCase()}${url.pathname}`;
  return NextResponse.rewrite(url);
}
