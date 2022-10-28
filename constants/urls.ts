import { Networks } from "@zoralabs/nft-hooks";
export const ArtivaNetworks = { ...Networks, GOERLI: 5 };

export const ARWEAVE_GATEWAY_URL = "https://arweave.net";
export const ARWEAVE_GRAPHQL_URL = "https://arweave.net/graphql";
export const ESTUARY_UPLOADER_BASEURL = "https://upload.estuary.tech";
export const ESTUARY_API_BASEURL = "https://api.estuary.tech";
export const PINATA_API_BASEURL = "https://api.pinata.cloud";

export const RARIBLE_API_BY_NETWORK = {
  [Networks.MAINNET]: "https://api.rarible.org/v0.1",
  [Networks.POLYGON]: "https://api.rarible.org/v0.1",
  [Networks.RINKEBY]: "https://api-staging.rarible.org/v0.1",
  [Networks.MUMBAI]: "https://api-staging.rarible.org/v0.1",
};

export const RESERVOIR_API_BY_NETWORK = {
  [Networks.MAINNET]: "https://api.reservoir.tools",
  [Networks.POLYGON]: "https://api-polygon.reservoir.tools",
};

export const ZORA_EDITIONS_BY_NETWORK = {
  [Networks.MAINNET]:
    "https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet",
};

export const BLOCK_EXPLORER_BY_NETWORK = {
  [ArtivaNetworks.GOERLI]: "https://goerli.etherscan.io",
  [ArtivaNetworks.POLYGON]: "https://polygonscan.com/",
};
