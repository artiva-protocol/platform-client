import Layout from "@/components/Layout";
import { usePosts, PostProps, ArtivaContext } from "@artiva/shared";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
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

const Post = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { postid } = router.query;
  const ctx = useContext(ArtivaContext);
  const { data: postData } = usePosts();

  const { themeURL } = useInitTheme({ platform });

  const PostDynamic = useThemeComponent<PostProps>({
    component: "./Post",
    themeURL,
  });

  const post = useMemo(() => {
    return postData?.find((x: any) => x.id === postid);
  }, [postid, postData]);

  if (!PostDynamic || !post) return <Fragment />;

  const props: PostProps = {
    ctx,
    post,
    platform,
  };

  return (
    <Layout>
      <PostDynamic {...props} />
    </Layout>
  );
};

export default Post;
