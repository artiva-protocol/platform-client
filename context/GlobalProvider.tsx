import { getWalletClient } from "../configs/wallet-config";
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
import MetadataContext from "./MetadataContext";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from "@rainbow-me/rainbowkit-siwe-next-auth";

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
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider
          enabled={admin}
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <SharedConfigContext.Provider value={{ ...ArtivaClientConfig }}>
            <SWRConfig value={{ fetcher, revalidateIfStale: false }}>
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
  );
};

export default GlobalProvider;
