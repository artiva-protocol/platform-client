import Layout from "@/components/Layout";
import { ArtivaContext, Platform, TagProps } from "@artiva/shared";
import { Fragment } from "react";
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

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ platform: string }>): Promise<
  GetStaticPropsResult<{ platform: Platform }>
> => {
  const platformData = await getPlatformMetadataByPlatform(params!.platform);

  if (!platformData)
    return {
      notFound: true,
    };

  return {
    props: {
      platform: platformData,
    },
    revalidate: 60,
  };
};

const TagComponent = ({
  platform,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const ctx = useContext(ArtivaContext);
  const themeURL = useThemeURL({ theme: platform.themeURL });
  const {
    query: { platform: platformId, tag },
  } = useRouter();

  const TagDynamic = useThemeComponent<TagProps>({
    component: "./Tag",
    themeURL,
  });

  if (!TagDynamic) return <Fragment />;

  const parsedTag = decodeURIComponent(tag as string);

  return (
    <Layout platform={platform}>
      <TagDynamic
        platform={{ ...platform, id: platformId as string }}
        ctx={ctx}
        tag={parsedTag}
      />
    </Layout>
  );
};

export default TagComponent;
