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
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
import {
  getPlatformMetadataByPlatform,
  getPostByPlatformAndId,
} from "@/services/platform-graph";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { postid } = context.query;

  const platform = getPlatformMetadataByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
  );

  const post = getPostByPlatformAndId(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!,
    postid as string
  );

  const res = await Promise.all([platform, post]);

  return {
    props: {
      platform: res[0],
      post: res[1],
    },
  };
};

const PostComponent = ({
  platform,
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
