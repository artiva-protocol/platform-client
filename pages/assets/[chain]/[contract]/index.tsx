import { useRouter } from "next/router";
import { ChainIdentifier, NFTContractProps } from "@artiva/shared";
import { Fragment } from "react";
import { useNFTContract, ArtivaContext, Platform } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { InferGetServerSidePropsType } from "next";
import { getMetadata } from "@/services/artiva-protocol";
import useInitTheme from "@/hooks/theme/useInitTheme";

export const getServerSideProps = async () => {
  const platform: Platform = await getMetadata();

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
    nftContract,
    platform,
  };

  if (!NFTComponentDynamic) return <Fragment />;
  return <NFTComponentDynamic {...props} />;
};

export default NFTContract;
