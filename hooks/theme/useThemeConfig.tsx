import { ThemeConfig } from "@artiva/shared";
//@ts-ignore
import { injectScript } from "@module-federation/nextjs-mf/utils/index";
import { sha256 } from "js-sha256";
import { useCallback, useEffect, useState } from "react";

export type ThemeConfigProps = {
  themeURL?: string;
};

const useThemeConfig = ({ themeURL }: ThemeConfigProps) => {
  const [config, setConfig] = useState<ThemeConfig | undefined>();

  const loadComponent = useCallback(() => {
    return injectScript({
      global: "theme",
      url: themeURL,
      uniqueKey: themeURL ? sha256(themeURL) : "theme",
    })
      .then((remoteContainer: any) => remoteContainer.get("./artiva.config"))
      .then((factory: any) => factory());
  }, [themeURL]);

  useEffect(() => {
    const handler = async () => {
      const dynamicModule = await loadComponent();
      setConfig(dynamicModule.default);
    };
    handler();
  }, [loadComponent]);

  return config;
};

export default useThemeConfig;
