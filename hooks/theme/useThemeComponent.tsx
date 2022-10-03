import dynamic from "next/dynamic";
//@ts-ignore
import { injectScript } from "@module-federation/nextjs-mf/utils/index";

export type ThemeComponentProps = {
  component: string;
  themeIdentifier: string;
};

const useThemeComponent = <T,>({
  component,
  themeIdentifier,
}: ThemeComponentProps) => {
  const global = themeIdentifier.split("@")[0];
  const url = themeIdentifier.split("@")[1];

  return dynamic<T>(
    () => {
      console.log("global", (window as any)[global]);
      return injectScript({
        global,
        url,
        uniqueKey: themeIdentifier,
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
