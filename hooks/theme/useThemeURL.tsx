import themes from "@/configs/themes-config";
import { useMemo } from "react";

const useThemeURL = ({
  theme,
  remoteEntry = true,
}: {
  theme?: string;
  remoteEntry?: boolean;
}): string | undefined => {
  return useMemo(() => {
    let themeURL: string | undefined;
    if (!theme) themeURL = themes.get("baseline")?.url;
    else themeURL = theme.includes("http") ? theme : themes.get(theme)?.url;

    return `${themeURL}${remoteEntry ? "/remoteEntry.js" : ""}`;
  }, [theme, remoteEntry]);
};

export default useThemeURL;
