import { Fragment } from "react";
import Layout from "@/components/Layout";
import { ArtivaContext, HomeProps, Platform } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { useRouter } from "next/router";
import useThemeURL from "@/hooks/theme/useThemeURL";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ platform: string }>
): Promise<GetStaticPropsResult<{ platform: Platform }>> => {
  const { platform: platformContract } = context.params!;
  const platform = await getPlatformMetadataByPlatform(platformContract);

  if (!platform) return { notFound: true };

  return {
    props: {
      platform,
    },
    revalidate: 60,
  };
};

const Home = ({ platform }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const ctx = useContext(ArtivaContext);

  const themeURL = useThemeURL({ theme: platform.themeURL });
  const {
    query: { platform: platformId },
  } = useRouter();

  const HomeDynamic = useThemeComponent<HomeProps>({
    component: "./Home",
    themeURL,
  });

  return (
    <Layout platform={platform}>
      {HomeDynamic ? (
        <HomeDynamic
          ctx={ctx}
          platform={{ ...platform, id: platformId as string }}
        />
      ) : (
        <Fragment />
      )}
    </Layout>
  );
};

export default Home;
