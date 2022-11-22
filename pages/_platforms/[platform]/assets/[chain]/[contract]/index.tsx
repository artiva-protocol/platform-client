import { useRouter } from "next/router";
import {
  ChainIdentifier,
  NFTContractProps,
  useNFTContract,
} from "@artiva/shared";
import { Fragment } from "react";
import { ArtivaContext } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import Layout from "@/components/Layout";
import useThemeURL from "@/hooks/theme/useThemeURL";

export const getServerSideProps = async ({
  res,
  query,
}: GetServerSidePropsContext) => {
  const { platform: platformContract } = query;
  const platform = await getPlatformMetadataByPlatform(
    platformContract as string
  );

  if (!platform)
    return {
      notFound: true,
    };

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {
      platform,
    },
  };
};

const NFTContract = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    query: { platform: platformId, chain, contract },
  } = useRouter();

  const ctx = useContext(ArtivaContext);
  const { data } = useNFTContract({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
  });

  const themeURL = useThemeURL({ theme: platform.themeURL });

  const NFTComponentDynamic = useThemeComponent<NFTContractProps>({
    component: "./NFTContract",
    themeURL,
  });

  const props: NFTContractProps = {
    ctx,
    platform: { ...platform, id: platformId as string },
    nftContract: data,
  };

  if (!NFTComponentDynamic) return <Fragment />;
  return (
    <Layout platform={platform}>
      <NFTComponentDynamic {...props} />
    </Layout>
  );
};

export default NFTContract;
