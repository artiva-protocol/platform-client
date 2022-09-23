import { Fragment } from "react";
import Layout from "@/components/Layout";
import { ArtivaContext, Platform, HomeProps } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { InferGetServerSidePropsType } from "next";
import { getMetadata } from "@/services/artiva-protocol";
import useInitTheme from "@/hooks/theme/useInitTheme";

export const getServerSideProps = async () => {
  const platform: Platform = await getMetadata();

  return {
    props: {
      platform: platform,
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
