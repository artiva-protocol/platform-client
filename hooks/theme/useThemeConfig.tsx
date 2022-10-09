import { ThemeConfig } from "@artiva/shared";
import { injectScript } from "@module-federation/nextjs-mf/utils";
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
