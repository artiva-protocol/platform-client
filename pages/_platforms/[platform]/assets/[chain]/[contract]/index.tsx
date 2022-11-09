import { useRouter } from "next/router";
import { ChainIdentifier, NFTContractProps } from "@artiva/shared";
import { Fragment } from "react";
import { ArtivaContext } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { getNFTContractPrimaryData } from "@/services/nft-contract";
import Layout from "@/components/Layout";
import useThemeURL from "@/hooks/theme/useThemeURL";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { platform: platformContract } = context.query;
  const platform = (await getPlatformMetadataByPlatform(
    platformContract as string
  ))!;

  const { chain, contract } = context.query;

  const data = await getNFTContractPrimaryData({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
  });
  const jsonData = JSON.parse(JSON.stringify(data));

  return {
    props: {
      platform,
      data: jsonData,
    },
  };
};

const NFTContract = ({
  platform,
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    query: { platform: platformId },
  } = useRouter();

  const ctx = useContext(ArtivaContext);

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
