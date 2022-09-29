import dynamic from "next/dynamic";
//@ts-ignore
import { injectScript } from "@module-federation/nextjs-mf/utils/index";

export type ThemeComponentProps = {
  component: string;
  themeURL?: string;
};

const useThemeComponent = <T,>({
  component,
  themeURL,
}: ThemeComponentProps) => {
  return dynamic<T>(
    () => {
      (window as any).theme = undefined;
      return injectScript({
        global: "theme",
        url: themeURL,
        uniqueKey: themeURL,
      })
        .then((remoteContainer: any) => remoteContainer.get(component))
        .then((factory: any) => factory());
    },
    {
      ssr: false,
      suspense: false,
    }
  );
};

export default useThemeComponent;
