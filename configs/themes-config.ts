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
  url: "https://arweave.net/VscA7AvwMlnNBx0lf2fr15HHyj1CV5PHKwvA5bsC_nc",
  hidden: false,
  previewImage: "baseline-preview.png",
  title: "Baseline (Default)",
  category: "Gallery",
});

themes.set("lens", {
  url: "https://arweave.net/sIlWjwd3YCmfU9OjH_nALXYGwFNi_mpapuEMcWl7jNc",
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
