import Head from "next/head";

export const ThemeCSS = ({ themeURL }: { themeURL: string }) => {
  return (
    <Head>
      <link key="theme-css" rel="stylesheet" href={`${themeURL}/index.css`} />
    </Head>
  );
};
