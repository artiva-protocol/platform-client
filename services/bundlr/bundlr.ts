import Bundlr from "@bundlr-network/client";
import { BigNumber } from "bignumber.js";
import { BundlrConfig } from "configs/bundlr-config";

const privateKey = process.env.BUNDLR_PRIVATE_KEY;

const { url, currency, fundPostAmount } = BundlrConfig;

const bundlr = new Bundlr(url, currency, privateKey);

const loadBalance = async (price: BigNumber) => {
  return await bundlr.fund(price.multipliedBy(fundPostAmount));
};

export const upload = async (
  content: Buffer,
  tags: { name: string; value: string }[]
): Promise<any> => {
  const bal = await bundlr.getLoadedBalance();
  const price = await bundlr.getPrice(content.length);

  if (bal.lt(price)) await loadBalance(price);
  return bundlr.uploader.upload(content, { tags }).then((x) => x.data);
};
