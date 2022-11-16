export type ThemeType = {
  url: string;
  previewImage: string;
  title: string;
  category: string;
};

const themes = new Map<string, ThemeType>();

themes.set("baseline", {
  url: "https://arweave.net/k1MCnCgQFlhgOYEJVyrMk-5CnSkMo05-H6fqbe0MxEo",
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/QC77HYEmbE2eQLMTMitaGO0WXYRAKBKsc1N54QxkXhM",
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

export default themes;
