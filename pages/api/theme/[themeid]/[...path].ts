import themes from "@/configs/themes-config";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const handler = (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const [theme, file] = pathname.replace("/api/theme/", "").split("/");
  const { url } = themes.get(theme as string) || {};

  return NextResponse.redirect(`${url}/${file}`);
};

export default handler;
