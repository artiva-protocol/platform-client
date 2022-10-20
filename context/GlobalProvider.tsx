import { getWalletClient, WalletAppContext } from "../configs/wallet-config";
import { WagmiConfig } from "wagmi";
import {
  ConnectButton,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  SharedConfigContext,
  ArtivaContext,
  DefaultComponents,
  DefaultHooks,
} from "@artiva/shared";
import { SWRConfig } from "swr";
import axios from "axios";
import Image from "next/future/image";
import { ArtivaClientConfig } from "configs/artiva-client-config";
import ThemeContext, { ThemeCSSWrapper } from "./ThemeContext";
import { useRouter } from "next/router";
import MetadataContext from "./MetadataContext";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";

const GlobalProvider = ({
  children,
  pageProps,
}: {
  children: React.ReactChild;
  pageProps: any;
}) => {
  const { pathname } = useRouter();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { wagmiClient, chains } = getWalletClient(
    pathname.includes("artiva") || pathname.includes("app")
      ? WalletAppContext.ADMIN
      : WalletAppContext.PLATFORM
  );

  const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: "Sign in to Artiva",
    domain: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
    uri: process.env.NEXT_PUBLIC_DEPLOYMENT_URL,
  });

  return (
    <ThemeContext.Provider>
      <ThemeCSSWrapper>
        <WagmiConfig client={wagmiClient}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <SharedConfigContext.Provider value={{ ...ArtivaClientConfig }}>
                <SWRConfig value={{ fetcher, refreshInterval: 30000 }}>
                  <RainbowKitProvider
                    chains={chains}
                    theme={lightTheme({
                      borderRadius: "medium",
                      fontStack: "system",
                      overlayBlur: "small",
                    })}
                  >
                    <ArtivaContext.Provider
                      value={{
                        components: {
                          ...DefaultComponents,
                          ConnectButton: ConnectButton.Custom,
                          Image: Image,
                          Link: Link,
                        },
                        hooks: DefaultHooks,
                      }}
                    >
                      <MetadataContext.Provider>
                        {children}
                      </MetadataContext.Provider>
                    </ArtivaContext.Provider>
                  </RainbowKitProvider>
                </SWRConfig>
              </SharedConfigContext.Provider>
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </WagmiConfig>
      </ThemeCSSWrapper>
    </ThemeContext.Provider>
  );
};

export default GlobalProvider;
