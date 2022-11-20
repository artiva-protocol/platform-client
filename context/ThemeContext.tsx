import useThemeModule from "@/hooks/theme/useThemeModule";
import {
  ArtivaContext,
  ArtivaContextType,
  DefaultComponents,
  DefaultHooks,
  Platform,
} from "@artiva/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import useSWR from "swr";
import { Container } from "unstated-next";

const ThemeContext = ({ children }: { children: React.ReactElement }) => {
  const {
    query: { platform },
  } = useRouter();
  const { data } = useSWR<Platform>(`/api/platform/${platform}/meta`);

  const { data: globalContextModule } = useThemeModule<{
    default: Container<any>;
  }>({
    themeURL: data?.themeURL,
    moduleName: "./GlobalContext",
  });

  const ctxValues: ArtivaContextType = {
    components: {
      ...DefaultComponents,
      ConnectButton: ConnectButton.Custom,
      Image: Image,
      Link: Link,
    },
    hooks: {
      ...DefaultHooks,
    },
    context: {},
  };

  if (!globalContextModule)
    return (
      <ArtivaContext.Provider value={ctxValues}>
        {children}
      </ArtivaContext.Provider>
    );
  const { default: GlobalContext } = globalContextModule;
  ctxValues.context.GlobalContext = GlobalContext;

  return (
    <GlobalContext.Provider>
      <ArtivaContext.Provider value={ctxValues}>
        <GlobalComponentWrapper GlobalContext={GlobalContext}>
          {children}
        </GlobalComponentWrapper>
      </ArtivaContext.Provider>
    </GlobalContext.Provider>
  );
};

const GlobalComponentWrapper = ({
  children,
  GlobalContext,
}: {
  children: React.ReactElement;
  GlobalContext: Container<any>;
}) => {
  const { globalComponent } = GlobalContext.useContainer();
  if (!globalComponent) return children;

  return (
    <Fragment>
      {children}
      {globalComponent}
    </Fragment>
  );
};

export default ThemeContext;
