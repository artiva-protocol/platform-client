import { useRouter } from "next/router";
import { ChainIdentifier, useNFT, ArtivaContext } from "@artiva/shared";
import { NFTProps } from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import { Fragment } from "react";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import useInitTheme from "@/hooks/theme/useInitTheme";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { platform: platformContract } = context.query;
  const platform = (await getPlatformMetadataByPlatform(
    platformContract as string
  ))!;

  return {
    props: {
      platform,
    },
  };
};

const NFT = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { chain, contract, tokenid } = router.query;
  const ctx = useContext(ArtivaContext);
  const {
    query: { platform: platformId },
  } = useRouter();

  const { themeURL } = useInitTheme({ platform });

  const NFTComponentDynamic = useThemeComponent<NFTProps>({
    component: "./NFT",
    themeURL,
  });

  const { data: nft } = useNFT({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
    tokenId: tokenid as string,
  });

  const props: NFTProps = {
    nft: nft as NFTObject,
    ctx,
    platform: { ...platform, id: platformId as string },
  };

  if (!NFTComponentDynamic) return <Fragment />;
  return <NFTComponentDynamic {...props} />;
};

export default NFT;
