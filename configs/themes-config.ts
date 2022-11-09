export type ThemeType = {
  url: string;
  previewImage: string;
  title: string;
  category: string;
};

const themes = new Map<string, ThemeType>();

themes.set("baseline", {
  url: "https://zk5tnna4qpsbouy266fjopnrpb6lrs5nkhe25gjqfqnphfv2uj7a.arweave.net/yrs2tByD5BdTGveKlz2xeHy4y61Rya6ZMCwa85a6on4",
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://2crssoz5fgykb66dmtnybdcykf3ryp4knpg6q4jpxbwnr6ia2isa.arweave.net/0KMpOz0psKD7w2TbgIxYUXccP4przehxL7hs2PkA0iQ",
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

export default themes;
