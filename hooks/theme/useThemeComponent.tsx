import dynamic from "next/dynamic";
import { injectScript } from "@module-federation/nextjs-mf/utils";
import { useMemo } from "react";

export type ThemeComponentProps = {
  component: string;
  themeURL?: string;
};

const useThemeComponent = <T,>(props?: ThemeComponentProps) => {
  return useMemo(() => {
    return props
      ? dynamic<T>(
          () =>
            injectScript({
              global: "theme",
              url: props?.themeURL,
            })
              .then((remoteContainer: any) =>
                remoteContainer.get(props?.component)
              )
              .then((factory: any) => factory()),
          {
            ssr: false,
            suspense: false,
          }
        )
      : undefined;
  }, [props]);
};

export default useThemeComponent;
