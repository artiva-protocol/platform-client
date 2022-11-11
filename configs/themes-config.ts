export type ThemeType = {
  url: string;
  previewImage: string;
  title: string;
  category: string;
};

const themes = new Map<string, ThemeType>();

themes.set("baseline", {
  url: "https://arweave.net/LJA3okTOD-7_ECLdoePNU2nmZvVh-KFnKs-QbOMnfwU",
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/22pI30EInPZpx82PVEs47ADau61X2yJqSzWDzvfO2g4",
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

export default themes;
