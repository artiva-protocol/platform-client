import Layout from "@/components/Layout";
import {
  ArtivaContext,
  usePostContent,
  NFTProps,
  NFTContractProps,
  PostTypeEnum,
  Platform,
  Post,
} from "@artiva/shared";
import { Fragment } from "react";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
import {
  getPlatformMetadataByPlatform,
  getPostByPlatformAndId,
} from "@/services/platform-graph";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ postid: string; platform: string }>): Promise<
  GetStaticPropsResult<{ platform: Platform; post: Post }>
> => {
  const [platformData, post] = await Promise.all([
    getPlatformMetadataByPlatform(params!.platform),
    getPostByPlatformAndId(params!.platform, params!.postid),
  ]);

  if (!platformData || !post)
    return {
      notFound: true,
    };

  return {
    props: {
      platform: platformData,
      post,
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
  const {
    query: { platform: platformId },
  } = useRouter();

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
        <NFTDynamic
          platform={{ ...platform, id: platformId as string }}
          ctx={ctx}
          nft={nft}
        />
      ) : NFTContractDynamic ? (
        <NFTContractDynamic
          platform={{ ...platform, id: platformId as string }}
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
