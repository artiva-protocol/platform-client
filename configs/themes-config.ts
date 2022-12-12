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
  url: "https://arweave.net/z30L3cGf5xUxYYw0X5dzFdz6hA0x_rVFV8vMhWiPT-I",
  hidden: false,
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/ryixUYDMbEwGtaMydWNFMAE-WPzDoX4tCQp5gcH5x-E",
  hidden: false,
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

themes.set("glass", {
  url: "https://arweave.net/WBK-HGtsz5tobndPtiUYDjf75RjyJXpLfYRoKsjiQhs",
  hidden: true,
});

export default themes;
