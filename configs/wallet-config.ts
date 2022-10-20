import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, chain, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export enum WalletAppContext {
  PLATFORM,
  ADMIN,
}

export const ChainsByAppContext = {
  [WalletAppContext.PLATFORM]: [
    chain.mainnet,
    chain.polygon,
    chain.arbitrum,
    chain.optimism,
  ],
  [WalletAppContext.ADMIN]: [chain.goerli],
};

export const getWalletClient = (ctx: WalletAppContext) => {
  const { chains, provider } = configureChains(ChainsByAppContext[ctx], [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
    publicProvider(),
  ]);

  const { connectors } = getDefaultWallets({
    appName: "Artiva",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return { wagmiClient, chains };
};
