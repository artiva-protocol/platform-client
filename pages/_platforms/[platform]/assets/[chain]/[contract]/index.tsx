import { useRouter } from "next/router";
import { ChainIdentifier, NFTContractProps } from "@artiva/shared";
import { Fragment } from "react";
import { useNFTContract, ArtivaContext } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
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

const NFTContract = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { chain, contract } = router.query;
  const ctx = useContext(ArtivaContext);

  const { themeURL } = useInitTheme({ platform });

  const NFTComponentDynamic = useThemeComponent<NFTContractProps>({
    component: "./NFTContract",
    themeURL,
  });

  const { data: nftContract } = useNFTContract({
    contractAddress: contract as string,
    chain: chain as ChainIdentifier,
  });

  const props: NFTContractProps = {
    ctx,
    platform,
    nftContract,
  };

  if (!NFTComponentDynamic) return <Fragment />;
  return <NFTComponentDynamic {...props} />;
};

export default NFTContract;
