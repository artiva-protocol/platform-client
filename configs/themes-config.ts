export type ThemeType = {
  url: string;
  previewImage: string;
  title: string;
  category: string;
};

const themes = new Map<string, ThemeType>();

themes.set("baseline", {
  url: "https://arweave.net/yrs2tByD5BdTGveKlz2xeHy4y61Rya6ZMCwa85a6on4",
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/0KMpOz0psKD7w2TbgIxYUXccP4przehxL7hs2PkA0iQ",
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

export default themes;
