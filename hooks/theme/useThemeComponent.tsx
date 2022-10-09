import dynamic from "next/dynamic";
import { injectScript } from "@module-federation/nextjs-mf/utils";
import { useCallback, useMemo } from "react";

export type ThemeComponentProps = {
  component: string;
  themeURL?: string;
};

const useThemeComponent = <T,>({
  component,
  themeURL,
}: ThemeComponentProps) => {
  const loadComponent = useCallback(() => {
    return injectScript({
      global: "theme",
      url: themeURL,
    })
      .then((remoteContainer: any) => remoteContainer.get(component))
      .then((factory: any) => factory());
  }, [component, themeURL]);

  return useMemo(() => {
    return dynamic<T>(() => loadComponent(), {
      ssr: false,
      suspense: false,
    });
  }, [loadComponent]);
};

export default useThemeComponent;
