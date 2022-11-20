import { getWalletClient } from "../configs/wallet-config";
import { WagmiConfig } from "wagmi";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SharedConfigContext } from "@artiva/shared";
import { SWRConfig } from "swr";
import axios from "axios";
import { ArtivaClientConfig } from "configs/artiva-client-config";
import MetadataContext from "./MetadataContext";
import { SessionProvider } from "next-auth/react";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import React from "react";
import ThemeContext from "./ThemeContext";

const { wagmiClient, chains, admin } = getWalletClient();

const GlobalProvider = ({
  children,
  pageProps,
}: {
  children: React.ReactChild;
  pageProps: any;
}) => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: "Sign in to Artiva",
    domain: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  });

  return (
    <SWRConfig value={{ fetcher, revalidateIfStale: false }}>
      <ThemeContext>
        <WagmiConfig client={wagmiClient}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <RainbowKitSiweNextAuthProvider
              enabled={admin}
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <SharedConfigContext.Provider value={{ ...ArtivaClientConfig }}>
                <RainbowKitProvider
                  chains={chains}
                  theme={lightTheme({
                    borderRadius: "medium",
                    fontStack: "system",
                    overlayBlur: "small",
                  })}
                >
                  <MetadataContext.Provider>
                    {children}
                  </MetadataContext.Provider>
                </RainbowKitProvider>
              </SharedConfigContext.Provider>
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </WagmiConfig>
      </ThemeContext>
    </SWRConfig>
  );
};

export default GlobalProvider;
