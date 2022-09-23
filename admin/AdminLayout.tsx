import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getWalletClient, WalletAppContext } from "configs/wallet-config";
import useAuthModal from "hooks/auth/useAuthModal";
import { useRouter } from "next/router";
import React from "react";
import { WagmiConfig } from "wagmi";
import AdminNavigation from "./AdminNavigation";
import NFTContractNavigation from "./collection/nftContracts/NFTContractNavigation";
import NFTNavigation from "./collection/nfts/NFTNavigation";
import DesignNavigation from "./design/DesignNavigation";

const AdminLayout = ({ children }: { children: React.ReactChild }) => {
  const router = useRouter();
  const { content } = useAuthModal();
  const { chains, wagmiClient } = getWalletClient(WalletAppContext.ADMIN);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small",
        })}
      >
        <div className="flex">
          {content}
          {router.pathname.includes("design") ? (
            <DesignNavigation />
          ) : router.pathname.includes("nfts") ? (
            <NFTNavigation />
          ) : router.pathname.includes("contracts") ? (
            <NFTContractNavigation />
          ) : (
            <AdminNavigation />
          )}
          <div className="w-full">{children}</div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default AdminLayout;
