import { useMetadata, Platform, CustomProperty } from "@artiva/shared";
import useSaveMetadata, {
  UseSaveMetadataType,
} from "hooks/platform/useSaveMetadata";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createContainer } from "unstated-next";
import deepmerge from "deepmerge";
import useThemeConfig from "@/hooks/theme/useThemeConfig";
import loadCustomDefaults from "utils/loadCustomDefaults";

export type CustomPropertyDesigner = {
  key: string;
  title: string;
} & CustomProperty;

export type UseDesignerProps = { init?: Platform };
export type UseDesignerType = {
  data: Platform | undefined;
  mutate: (platform: Platform) => Platform;
  merge: (platform: Partial<Platform>) => Platform | undefined;
  save: UseSaveMetadataType;
  customProperties: CustomPropertyDesigner[] | undefined;
  mobile: boolean;
  setMobile: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

const useDesigner = (): UseDesignerType => {
  const { data: initalData, error } = useMetadata();
  const [data, setData] = useState<Platform | undefined>();
  const [dirty, setDirty] = useState(false);
  const [mobile, setMobile] = useState(false);
  const save = useSaveMetadata({ data });
  const config = useThemeConfig({
    themeURL: `${
      data?.themeURL || process.env.NEXT_PUBLIC_BASE_THEME_URL
    }/remoteEntry.js`,
  });

  const loadCustomCallback = useCallback(
    (platform: Platform) => loadCustomDefaults(config, platform),
    [config]
  );

  const merge = (platform: Partial<Platform>) => {
    if (!data) return;
    const mergeData = deepmerge(platform, data);
    return mutate(mergeData);
  };

  const mutate = (platform: Platform) => {
    if (!dirty) setDirty(true);
    setData(platform);
    return platform;
  };

  const customProperties = useMemo(() => {
    if (!config) return;

    const properties: CustomPropertyDesigner[] = [];
    for (const key in config.custom) {
      properties.push({
        key,
        title: key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
        ...config.custom[key],
      });
    }

    return properties;
  }, [config]);

  useEffect(() => {
    if (!initalData || data) return;
    setData(loadCustomCallback(initalData));
  }, [initalData, data, loadCustomCallback]);

  return {
    data,
    mutate,
    merge,
    save,
    mobile,
    setMobile,
    customProperties,
    loading: !data && !error,
  };
};

export default createContainer<UseDesignerType, Platform>(useDesigner);
