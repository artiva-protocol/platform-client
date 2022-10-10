import EstuaryAdapter from "adapters/ipfs/estuary/EstuaryAdapter";
import IIPFSAdapter from "adapters/ipfs/IIPFSAdapter";
import { ChainIdentifier } from "@artiva/shared";
import { NFTStrategy } from "@zoralabs/nft-hooks/dist/strategies";
import { IMarketAdapter, RendererConfig } from "@artiva/shared";
import { EVM_CHAIN_IDENTIFIER_TO_CHAINID } from "constants/EVMChainIDLookup";
import { NetworkIDs } from "@zoralabs/nft-hooks";
import { DefaultMarketAdapters } from "adapters/markets";
import { DefaultRenderers } from "adapters/renderers";
import { RaribleStrategy } from "adapters/nft-strategies/RaribleStrategy";
import { NFTContractStrategy } from "adapters/nft-contract-strategies/NFTContractStrategy";
import ZDKContractStrategy from "adapters/nft-contract-strategies/zdk/ZDKContractStrategy";
import {
  DefaultPrimarySaleAdapters,
  IPrimarySaleAdapter,
} from "adapters/primary-sales";
import PinataAdapter from "adapters/ipfs/pinata/PinataAdapter";

export type ArtivaClientConfigType = {
  IPFSAdapter: IIPFSAdapter;
  serverURL?: string;
  preferredIPFSGateway?: string;
  zoraAPIKey?: string;
  platformAddress?: string;
  getNFTStrategy?: (chainId: ChainIdentifier) => NFTStrategy;
  getNFTContractStrategy?: (chainId: ChainIdentifier) => NFTContractStrategy;
  marketAdapters?: IMarketAdapter[];
  primarySaleAdapters?: IPrimarySaleAdapter[];
  renderers?: RendererConfig[];
};

export const ArtivaClientConfig: ArtivaClientConfigType = {
  serverURL: "/api",
  IPFSAdapter: new PinataAdapter(),
  preferredIPFSGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY,
  zoraAPIKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
  platformAddress: process.env.NEXT_PUBLIC_PLATFORM_ADDRESS,
  getNFTStrategy: (chainId: ChainIdentifier) => {
    return new RaribleStrategy(
      EVM_CHAIN_IDENTIFIER_TO_CHAINID[chainId] as NetworkIDs
    );
  },
  getNFTContractStrategy: (chainId: ChainIdentifier) => {
    return new ZDKContractStrategy(
      EVM_CHAIN_IDENTIFIER_TO_CHAINID[chainId] as NetworkIDs
    );
  },
  marketAdapters: DefaultMarketAdapters,
  primarySaleAdapters: DefaultPrimarySaleAdapters,
  renderers: DefaultRenderers,
};
