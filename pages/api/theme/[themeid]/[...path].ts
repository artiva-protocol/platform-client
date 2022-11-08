import themes from "@/configs/themes-config";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { themeid, path } = req.query;
  const { url } = themes.get(themeid as string) || {};
  console.log("redirect", `${url}/${(path as string[]).join("/")}`);
  return res.redirect(`${url}/${(path as string[]).join("/")}`);
};

export default handler;
