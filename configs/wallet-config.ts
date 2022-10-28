import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, chain, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const isAdmin = () => {
  if (typeof window !== "object") return false;
  return (
    window.location.pathname.startsWith("/artiva") ||
    window.location.hostname.startsWith("app")
  );
};

export const getWalletClient = () => {
  const admin = isAdmin();
  const { chains, provider, webSocketProvider } = configureChains(
    admin ? [chain.polygon, chain.mainnet] : [chain.mainnet],
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "Artiva",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  return { wagmiClient, chains, admin };
};
