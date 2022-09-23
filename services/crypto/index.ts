import elliptic from "./elliptic";
import { sha256 } from "js-sha256";
import { ethers } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";

export const verifyElipticSig = (
  key: string,
  digest: string,
  data: any,
  signature: string
) => {
  if (sha256(data) !== digest) return false;
  const parsedKey = JSON.parse(key);
  const keyInstance = elliptic.keyFromPublic({
    x: parsedKey.x,
    y: parsedKey.y,
  });
  return keyInstance.verify(digest, signature);
};

export const verifyEthTypedData = (
  domain: ethers.TypedDataDomain,
  types: Record<string, ethers.TypedDataField[]>,
  value: Record<string, any>,
  signature: SignatureLike
) => {
  ethers.utils.verifyTypedData(domain, types, value, signature);
};

export const verifyEthSig = (
  address: string,
  signature: string,
  message: string
) => {
  return (
    address.toLowerCase() ===
    ethers.utils.verifyMessage(message, signature).toLowerCase()
  );
};
