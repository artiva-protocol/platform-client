import { useRouter } from "next/router";
import { ChainIdentifier, useNFT, ArtivaContext } from "@artiva/shared";
import { NFTProps } from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import { Fragment } from "react";
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

const NFT = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    query: { platform: platformId, chain, contract, tokenid },
  } = useRouter();
  const ctx = useContext(ArtivaContext);
  const themeURL = useThemeURL({ theme: platform.themeURL });

  const { data } = useNFT({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
    tokenId: tokenid as string,
  });

  const NFTComponentDynamic = useThemeComponent<NFTProps>({
    component: "./NFT",
    themeURL,
  });

  const props: NFTProps = {
    nft: data as NFTObject,
    ctx,
    platform: { ...platform, id: platformId as string },
  };

  if (!NFTComponentDynamic) return <Fragment />;
  return (
    <Layout platform={platform}>
      <NFTComponentDynamic {...props} />
    </Layout>
  );
};

export default NFT;
