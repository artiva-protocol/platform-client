import { Platform, ThemeConfig } from "@artiva/shared";

const loadCustomDefaults = (config?: ThemeConfig, platform?: Platform) => {
  if (!config || !platform) return;
  if (!platform.custom) platform.custom = {};
  for (const prop in config.custom) {
    if (platform.custom[prop] === undefined)
      platform.custom[prop] = config.custom[prop].default;
  }
  return platform;
};

export default loadCustomDefaults;
