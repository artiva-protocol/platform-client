import {
  Layout,
  usePosts,
  NFTRenderer,
  usePostContent,
  PostProps,
  usePrimarySale,
  EditionContractLike,
  PrimarySaleModule,
  PRIMARY_SALE_SOURCES,
  IPrimarySaleAdapter,
} from "@artiva/shared";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { useAccount, useSigner } from "wagmi";
import ConnectWallet from "@/components/market/ConnectWallet";
import BackButton from "@/components/market/BackButton";
import { useState } from "react";
import { ethers } from "ethers";
import CustomConnectButton from "@/components/CustomConnectButton";
import useThemeComponent from "@/hooks/theme/useThemeComponent";

const Mint = () => {
  const router = useRouter();
  const { postid } = router.query;
  const { data: postData } = usePosts();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const post = useMemo(() => {
    return postData?.find((x: any) => x.id === postid);
  }, [postid, postData]);
  const { nftContract } = usePostContent(post?.type, post?.content);
  const adapter = usePrimarySale(PRIMARY_SALE_SOURCES.zoraERC721Drop) as
    | IPrimarySaleAdapter
    | undefined;
  const [amount, setAmount] = useState(1);

  const PostDynamic = useThemeComponent<PostProps>({ component: "./Post" });

  const edition = useMemo(
    () =>
      nftContract?.markets?.find(
        (x: PrimarySaleModule) =>
          x.source === PRIMARY_SALE_SOURCES.zoraERC721Drop
      ),
    [nftContract?.markets]
  ) as EditionContractLike | undefined;

  if (!PostDynamic || !nftContract || !edition) return <Fragment />;

  const onBuyNow = async () => {
    setLoading(true);
    setError("");
    if (!signer || !edition || !adapter || !post?.content) return;

    adapter.connect(signer, post?.content?.contractAddress!);

    try {
      const tx = await adapter.purchase(
        amount,
        ethers.utils.parseEther(edition.salesConfig.publicSalePrice).mul(amount)
      );
      await tx.wait();
      setSuccess(true);
    } catch (err: any) {
      if (err.message.includes("insufficient funds")) {
        setError("Error insufficent funds for purchase");
        return;
      }
      err.error?.message ? setError(err.error.message) : setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const successControl = () => {
    return (
      <div className="w-full text-center">
        <div className="text-5xl">🥳</div>
        <div className="text-4xl font-semibold mt-6">
          NFT purchased successfully
        </div>
        <div className="text-lg mt-2 text-gray-500 font-light">
          Please wait a few minutes for the purchase to index
        </div>
        <button
          onClick={() => {
            router.back();
          }}
          className="w-2/3 h-12 bg-black text-white text-lg mt-8 rounded-md"
        >
          Return to NFT
        </button>
      </div>
    );
  };

  const buyControl = () => {
    return (
      <div className="w-2/3">
        <div className="text-4xl font-semibold">Mint Edition</div>
        <div className="text-lg mt-2 text-gray-500 font-light">
          Once the transaction is confirmed, the NFT will be sent to your wallet
          instantly.
        </div>
        <div className="flex items-center mt-4 ">
          <div className="bg-gray-100 w-full rounded-l-md h-12 px-4 text-xl font-light focus:outline-none flex items-center">
            {edition.salesConfig.publicSalePrice}
          </div>
          <div className="px-5 font-semibold bg-gray-200 h-12 flex items-center rounded-r-md">
            ETH
          </div>
        </div>
        <button
          onClick={onBuyNow}
          className="h-12 w-full bg-black text-white text-lg mt-6 rounded-md"
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>
        {error && (
          <p className="text-red-500 text-center mt-4 break-all">
            {error.slice(0, 300)}
          </p>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex relative">
        <div className="w-1/2 border-r flex items-center justify-around h-[100vh]">
          <NFTRenderer
            nft={{
              metadata: {
                imageUri: edition.contractInfo?.image,
              },
              rawData: {},
            }}
            className="object-cover h-[70vh] shadow-2xl"
          />
        </div>
        <div className="w-1/2 flex items-center justify-around h-[100vh]">
          {success ? (
            successControl()
          ) : address ? (
            buyControl()
          ) : (
            <ConnectWallet />
          )}
        </div>
        <BackButton />
        <div className="absolute top-5 right-5">
          <CustomConnectButton className="w-36 h-8 rounded-md bg-black text-white" />
        </div>
      </div>
    </Layout>
  );
};

export default Mint;
