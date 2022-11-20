import { useState } from "react";
import useThemeModule from "./useThemeModule";

const useThemeHook = ({
  themeURL,
  hookName,
}: {
  themeURL?: string;
  hookName: string;
}) => {
  const { data } = useThemeModule<any>({
    themeURL,
    moduleName: hookName,
  });

  //This is a hack to workaround the rules of hooks please replace with something better
  //@ts-ignore
  return data?.default() || useState();
};

export default useThemeHook;
