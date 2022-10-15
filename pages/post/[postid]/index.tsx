import Layout from "@/components/Layout";
import {
  ArtivaContext,
  usePostContent,
  NFTProps,
  NFTContractProps,
  PostTypeEnum,
} from "@artiva/shared";
import { Fragment } from "react";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
import {
  getPlatformMetadataByPlatform,
  getPostByPlatformAndId,
  getPostsByPlatform,
} from "@/services/platform-graph";

export async function getStaticPaths() {
  const posts = await getPostsByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
  );

  const paths = posts.map((post) => ({
    params: { postid: post.id },
  }));

  return { paths, fallback: "blocking" };
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ postid: string }>) => {
  const platform = getPlatformMetadataByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
  );

  const post = getPostByPlatformAndId(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!,
    params!.postid
  );

  const res = await Promise.all([platform, post]);

  return {
    props: {
      platform: res[0],
      post: res[1],
    },
    revalidate: 60,
  };
};

const PostComponent = ({
  platform,
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const ctx = useContext(ArtivaContext);

  const { nft, nftContract } = usePostContent(post.type, post.content);
  const { themeURL } = useInitTheme({ platform });

  const NFTDynamic = useThemeComponent<NFTProps>(
    post.type == PostTypeEnum.NFT
      ? {
          component: "./NFT",
          themeURL,
        }
      : undefined
  );

  const NFTContractDynamic = useThemeComponent<NFTContractProps>(
    post.type == PostTypeEnum.NFT_CONTRACT
      ? {
          component: "./NFTContract",
          themeURL,
        }
      : undefined
  );

  if (!NFTDynamic && !NFTContractDynamic) return <Fragment />;

  return (
    <Layout>
      {NFTDynamic ? (
        <NFTDynamic platform={platform} ctx={ctx} nft={nft} />
      ) : NFTContractDynamic ? (
        <NFTContractDynamic
          platform={platform}
          ctx={ctx}
          nftContract={nftContract}
        />
      ) : (
        <Fragment />
      )}
    </Layout>
  );
};

export default PostComponent;
