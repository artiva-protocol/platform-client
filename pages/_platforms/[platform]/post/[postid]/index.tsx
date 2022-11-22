import Layout from "@/components/Layout";
import {
  ArtivaContext,
  Platform,
  usePostContent,
  Post,
  PostProps,
} from "@artiva/shared";
import { Fragment } from "react";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { useRouter } from "next/router";
import { NFTObject } from "@zoralabs/nft-hooks";
import useThemeURL from "@/hooks/theme/useThemeURL";
import useSWR from "swr";

export const getServerSideProps = async ({
  res,
  query,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<{ platform: Platform }>
> => {
  const { platform } = query;

  const platformData = await getPlatformMetadataByPlatform(platform as string);

  if (!platformData)
    return {
      notFound: true,
    };

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {
      platform: platformData,
    },
  };
};

const PostComponent = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const ctx = useContext(ArtivaContext);
  const themeURL = useThemeURL({ theme: platform.themeURL });
  const {
    query: { platform: platformId, postid },
  } = useRouter();

  const { data: post } = useSWR<Post>(
    `/api/platform/${platformId}/post/${postid}`
  );
  const { data } = usePostContent(post);

  const PostDynamic = useThemeComponent<PostProps>({
    component: "./Post",
    themeURL,
  });

  if (!PostDynamic) return <Fragment />;

  return (
    <Layout platform={platform}>
      <PostDynamic
        platform={{ ...platform, id: platformId as string }}
        ctx={ctx}
        post={post}
        postData={data}
      />
    </Layout>
  );
};

export default PostComponent;
