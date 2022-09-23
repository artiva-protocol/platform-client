import Head from "next/head";
import React, { Fragment, useMemo } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";

const useThemeContext = () => {
  const { data: platform, mutate } = useSWR("/api/platform/meta");
  const themeURL = platform?.themeURL || process.env.NEXT_PUBLIC_BASE_THEME_URL;

  return { mutate, themeURL };
};

const container = createContainer(useThemeContext);

export const ThemeCSSWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { themeURL } = container.useContainer();
  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href={`${themeURL}/index.css`} />
      </Head>
      {children}
    </Fragment>
  );
};

export default container;
