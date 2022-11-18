export type ThemeType = {
  url: string;
  hidden: boolean;
  previewImage?: string;
  title?: string;
  category?: string;
};

const themes = new Map<string, ThemeType>();

const localTheme = "http://localhost:8080";

themes.set("baseline", {
  url: "https://arweave.net/eeoJpZylh6tLwX0p_5WWzcjvMGveGojRLTKFewW26_c",
  hidden: false,
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/DWOtdZzfz5KMsxXQRtb2VW2aq2PazGeQynY4fo8mp7I",
  hidden: false,
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

themes.set("glass", {
  url: "https://arweave.net/xBQ2ddp7PlC1cmoa1D4ueJCdGJSWEQlDR20kf-5zB1o",
  hidden: true,
});

export default themes;
