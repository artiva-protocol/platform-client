import { Fragment } from "react";
import Layout from "@/components/Layout";
import { ArtivaContext, HomeProps } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { InferGetServerSidePropsType } from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";

export const getServerSideProps = async () => {
  const platform = await getPlatformMetadataByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
  );

  return {
    props: {
      platform,
    },
  };
};

const Home = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
