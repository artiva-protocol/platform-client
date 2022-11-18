import { ArtivaClientConfig } from "@/configs/artiva-client-config";

export function getNormalizedURI(uri: string) {
  if (uri.startsWith("ipfs://")) {
    return uri.replace(
      "ipfs://",
      ArtivaClientConfig.preferredIPFSGateway || "https://ipfs.io/ipfs/"
    );
  }
  if (uri.includes("/ipfs/") && ArtivaClientConfig.preferredIPFSGateway) {
    return `${ArtivaClientConfig.preferredIPFSGateway}${uri.replace(
      /^.+\/ipfs\//,
      ""
    )}`;
  }
  if (uri.startsWith("ar://")) {
    return uri.replace("ar://", "https://arweave.net/");
  }

  return uri;
}
