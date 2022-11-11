export type ThemeType = {
  url: string;
  previewImage: string;
  title: string;
  category: string;
};

const themes = new Map<string, ThemeType>();

themes.set("baseline", {
  url: "https://arweave.net/YJWW1mbR8adItqgoA_RSrff2r9UEsOItsmPcsHilylE",
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/28li5UXMDPHKzndA-Q8Fbn8l19uqGMuEDChISMBGfsk",
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

export default themes;
