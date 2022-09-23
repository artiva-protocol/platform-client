import { Platform } from "@artiva/shared";
import ThemeContext from "@/context/ThemeContext";
import { useCallback, useEffect } from "react";
import useThemeConfig from "./useThemeConfig";
import loadCustomDefaults from "utils/loadCustomDefaults";

const useInitTheme = ({ platform }: { platform: Platform }) => {
  const themeURL = `${
    platform?.themeURL || process.env.NEXT_PUBLIC_BASE_THEME_URL
  }/remoteEntry.js`;
  const { mutate } = ThemeContext.useContainer();
  const config = useThemeConfig({ themeURL });

  const loadCustomCallback = useCallback(
    (platform: Platform) => loadCustomDefaults(config, platform),
    [config]
  );

  useEffect(() => {
    mutate(loadCustomCallback(platform));
  }, [platform, mutate, loadCustomCallback]);

  return { themeURL };
};

export default useInitTheme;
