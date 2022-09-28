import { useRouter } from "next/router";
import { ChainIdentifier, NFTContractProps } from "@artiva/shared";
import { Fragment } from "react";
import { useNFTContract, ArtivaContext } from "@artiva/shared";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { InferGetServerSidePropsType } from "next";
import useInitTheme from "@/hooks/theme/useInitTheme";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";

export const getServerSideProps = async () => {
  const platform = await getPlatformMetadataByPlatform(
    process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!
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
