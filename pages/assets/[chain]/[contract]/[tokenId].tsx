import { useRouter } from "next/router";
import { ChainIdentifier, useNFT, ArtivaContext } from "@artiva/shared";
import { NFTProps } from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import { Fragment } from "react";
import { useContext } from "react";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import useInitTheme from "@/hooks/theme/useInitTheme";
import { InferGetServerSidePropsType } from "next";
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

const NFT = ({
  platform,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { chain, contract, tokenId } = router.query;
  const ctx = useContext(ArtivaContext);

  const { themeURL } = useInitTheme({ platform });

  const NFTComponentDynamic = useThemeComponent<NFTProps>({
    component: "./NFT",
    themeURL,
  });

  const { data: nft } = useNFT({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
    tokenId: tokenId as string,
  });
  const props: NFTProps = { nft: nft as NFTObject, ctx, platform };

  if (!NFTComponentDynamic) return <Fragment />;
  return <NFTComponentDynamic {...props} />;
};

export default NFT;
