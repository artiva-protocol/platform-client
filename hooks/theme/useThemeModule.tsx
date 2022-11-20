import { injectScript } from "@module-federation/nextjs-mf/utils";
import { useCallback, useEffect, useState } from "react";

export type UseThemeModule = {
  themeURL?: string;
  moduleName: string;
};

const useThemeModule = <T,>({
  themeURL,
  moduleName,
}: UseThemeModule): { data: T | undefined; error: any } => {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<any | undefined>();

  const loadComponent = useCallback(() => {
    return injectScript({
      global: "theme",
      url: themeURL,
    })
      .then((remoteContainer: any) => remoteContainer.get(moduleName))
      .then((factory: any) => factory())
      .catch(setError);
  }, [themeURL, moduleName]);

  useEffect(() => {
    const handler = async () => {
      const dynamicModule = await loadComponent();
      setData(dynamicModule);
    };
    handler();
  }, [loadComponent]);

  return { data, error };
};

export default useThemeModule;
