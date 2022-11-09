import Layout from "@/components/Layout";
import {
  ArtivaContext,
  NFTProps,
  NFTContractProps,
  PostTypeEnum,
  Platform,
  Post,
  NFTContractObject,
} from "@artiva/shared";
import { Fragment } from "react";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import {
  getPlatformMetadataByPlatform,
  getPostByPlatformAndId,
} from "@/services/platform-graph";
import { useRouter } from "next/router";
import { getPostPrimaryData, PostData } from "@/services/post";
import { NFTObject } from "@zoralabs/nft-hooks";
import useThemeURL from "@/hooks/theme/useThemeURL";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ postid: string; platform: string }>): Promise<
  GetStaticPropsResult<{ platform: Platform; post: Post; data: PostData }>
> => {
  const [platformData, post] = await Promise.all([
    getPlatformMetadataByPlatform(params!.platform),
    getPostByPlatformAndId(params!.platform, params!.postid),
  ]);

  if (!platformData || !post)
    return {
      notFound: true,
    };

  const data = await getPostPrimaryData(post);
  const jsonData = JSON.parse(JSON.stringify(data));
  return {
    props: {
      platform: platformData,
      post,
      data: jsonData,
    },
    revalidate: 60,
  };
};

const PostComponent = ({
  platform,
  post,
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const ctx = useContext(ArtivaContext);
  const themeURL = useThemeURL({ theme: platform.themeURL });
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
    <Layout platform={platform}>
      {NFTDynamic ? (
        <NFTDynamic
          platform={{ ...platform, id: platformId as string }}
          ctx={ctx}
          nft={data as NFTObject}
        />
      ) : NFTContractDynamic ? (
        <NFTContractDynamic
          platform={{ ...platform, id: platformId as string }}
          ctx={ctx}
          nftContract={data as NFTContractObject}
        />
      ) : (
        <Fragment />
      )}
    </Layout>
  );
};

export default PostComponent;
