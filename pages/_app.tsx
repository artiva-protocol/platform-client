import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import GlobalProvider from "context/GlobalProvider";
import { Fragment } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider pageProps={pageProps}>
      <Fragment>
        <Component {...pageProps} />
      </Fragment>
    </GlobalProvider>
  );
}

export default MyApp;
