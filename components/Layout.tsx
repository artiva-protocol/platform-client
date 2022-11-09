import useThemeURL from "@/hooks/theme/useThemeURL";
import { Platform } from "@artiva/shared";
import React, { Fragment } from "react";
import { ThemeCSS } from "./ThemeCSS";

export type LayoutProps = { children: React.ReactNode; platform: Platform };

const Layout: React.FC<LayoutProps> = ({ children, platform }: LayoutProps) => {
  const themeURL = useThemeURL({
    theme: platform.themeURL,
    remoteEntry: false,
  });

  return (
    <Fragment>
      <ThemeCSS themeURL={themeURL || ""} />
      {children}
    </Fragment>
  );
};

export default Layout;
