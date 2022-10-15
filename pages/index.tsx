import { Fragment } from "react";
import Layout from "@/components/Layout";
import { ArtivaContext, HomeProps } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { InferGetStaticPropsType } from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";

export const getStaticProps = async () => {
  const platform = await getPlatformMetadataByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
  );

  return {
    props: {
      platform,
    },
    revalidate: 60,
  };
};

const Home = ({ platform }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const ctx = useContext(ArtivaContext);

  const { themeURL } = useInitTheme({ platform });

  const HomeDynamic = useThemeComponent<HomeProps>({
    component: "./Home",
    themeURL,
  });

  return (
    <Layout>
      {HomeDynamic ? (
        <HomeDynamic ctx={ctx} platform={platform} />
      ) : (
        <Fragment />
      )}
    </Layout>
  );
};

export default Home;
