import IIPFSAdapter from "adapters/ipfs/IIPFSAdapter";
import { ChainIdentifier } from "@artiva/shared";
import { EVM_CHAIN_IDENTIFIER_TO_CHAINID } from "constants/EVMChainIDLookup";
import { NetworkIDs } from "@zoralabs/nft-hooks";
import { SharedConfigType } from "@artiva/shared";

//Code splitting these external libraries so _app.tsx does not load with them
const ipfsAdapter = import("adapters/ipfs/estuary/EstuaryAdapter").then(
  (x) => new x.default()
);
const nftStrategy = import("adapters/nft-strategies/MultiMarket").then((x) => {
  return x.MultiMarket;
});
const nftContractStrategy = import(
  "adapters/nft-contract-strategies/zdk/ZDKContractStrategy"
).then((x) => x.default);
const DefaultMarketAdapters = import("adapters/markets").then(
  (x) => x.DefaultMarketAdapters
);
const DefaultPrimarySaleAdapters = import("adapters/primary-sales").then(
  (x) => x.DefaultPrimarySaleAdapters
);
const DefaultRenderers = import("adapters/renderers").then(
  (x) => x.DefaultRenderers
);

export type ArtivaClientConfigType = SharedConfigType & {
  IPFSAdapter: Promise<IIPFSAdapter>;
};

export const ArtivaClientConfig: ArtivaClientConfigType = {
  serverURL: "/api",
  preferredIPFSGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
  zoraAPIKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
  IPFSAdapter: ipfsAdapter,
  getNFTStrategy: async (chainId: ChainIdentifier) => {
    return new (await nftStrategy)(
      EVM_CHAIN_IDENTIFIER_TO_CHAINID[chainId] as NetworkIDs
    );
  },
  getNFTContractStrategy: async (chainId: ChainIdentifier) => {
    return new (await nftContractStrategy)(
      EVM_CHAIN_IDENTIFIER_TO_CHAINID[chainId] as NetworkIDs
    );
  },
  marketAdapters: DefaultMarketAdapters,
  primarySaleAdapters: DefaultPrimarySaleAdapters,
  renderers: DefaultRenderers,
};
