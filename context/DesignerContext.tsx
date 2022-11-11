import { Platform, CustomProperty } from "@artiva/shared";
import { UseSaveMetadataType } from "hooks/platform/useSaveMetadata";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";
import useThemeConfig from "@/hooks/theme/useThemeConfig";
import MetadataContext from "./MetadataContext";
import useThemeURL from "@/hooks/theme/useThemeURL";

export type CustomPropertyDesigner = {
  key: string;
  title: string;
} & CustomProperty;

export type UseDesignerProps = { init?: Platform };
export type UseDesignerType = {
  data: Platform | undefined;
  mutate: (platform: Platform) => void;
  merge: (platform: Partial<Platform>) => void;
  save: UseSaveMetadataType;
  customProperties: CustomPropertyDesigner[] | undefined;
  mobile: boolean;
  setMobile: Dispatch<SetStateAction<boolean>>;
};

const useDesigner = (): UseDesignerType => {
  const { data, save, mutate, merge } = MetadataContext.useContainer();
  const [customsInitilized, setCustomsInitilized] = useState(false);
  const [mobile, setMobile] = useState(false);
  const themeURL = useThemeURL({ theme: data?.themeURL });

  const config = useThemeConfig({
    themeURL,
  });

  useEffect(() => {
    setCustomsInitilized(false);
  }, [config]);

  useEffect(() => {
    if (
      !config ||
      !data ||
      Object.keys(data.custom).length < 1 ||
      customsInitilized
    )
      return;
    let tmp = {};
    Object.keys(config.custom).map((x) => {
      (tmp as any)[x] = config.custom[x].default;
    });
    merge({ custom: tmp });
    setCustomsInitilized(true);
  }, [data, config, merge, customsInitilized]);

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

  return { data, mutate, merge, save, mobile, setMobile, customProperties };
};

export default createContainer<UseDesignerType, Platform>(useDesigner);
