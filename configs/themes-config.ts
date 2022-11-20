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
  url: "https://arweave.net/O0ccAAzXMqlkhIuHw9I4MP0kVXMySafTAXDyDLEdH-8",
  hidden: false,
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/kOLRNAnee-IiF2UVWJcjI1F56wpe-CHZ_oXkGk-7pgE",
  hidden: false,
  previewImage: "lens-preview.png",
  title: "Lens",
  category: "Photography",
});

themes.set("glass", {
  url: "https://arweave.net/qXZdK50wSEcipyeq4ERzSjR-tWmOw0J3om4mL0SRMx0",
  hidden: true,
});

export default themes;
