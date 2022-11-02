import {
  Layout,
  NFTRenderer,
  useNFTContractSecondary,
  usePrimarySale,
  EditionContractLike,
  PrimarySaleModule,
  IPrimarySaleAdapter,
  ChainIdentifier,
  PRIMARY_SALE_TYPES,
  useNFT,
} from "@artiva/shared";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSigner } from "wagmi";
import BackButton from "@/components/market/BackButton";
import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import CustomConnectButton from "@/components/CustomConnectButton";

const Mint = () => {
  const router = useRouter();
  const { chain, contract } = router.query;
  const { data: signer } = useSigner();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: nftContract } = useNFTContractSecondary({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
  });

  const market = nftContract?.markets?.find(
    (x: any) => x.type === PRIMARY_SALE_TYPES.PublicEdition
  );

  const { data: nftPreview } = useNFT({
    contractAddress: contract as string,
    chain: chain as ChainIdentifier,
    tokenId: "1",
  });

  const adapter = usePrimarySale(market?.source) as
    | IPrimarySaleAdapter
    | undefined;

  const [amount, setAmount] = useState(1);

  const edition = useMemo(
    () =>
      nftContract?.markets?.find(
        (x: PrimarySaleModule) => x.type === PRIMARY_SALE_TYPES.PublicEdition
      ),
    [nftContract?.markets]
  ) as EditionContractLike | undefined;

  const onBuyNow = async () => {
    if (!signer || !edition || !adapter || !contract) return;

    setLoading(true);
    setError("");

    await adapter.connect(signer, contract as string);

    try {
      const tx = await adapter.purchase(
        amount,
        BigNumber.from(edition.price).mul(amount)
      );
      await tx.wait();
      setSuccess(true);
    } catch (err: any) {
      if (err.message.includes("user rejected transaction")) return;
      if (err.message.includes("insufficient funds")) {
        setError("Error insufficent funds for purchase");
        return;
      }
      err.error?.message ? setError(err.error.message) : setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const successControl = (
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

  const buyControl = (
    <div className="w-2/3">
      <div className="text-4xl font-semibold">Mint Edition</div>
      <div className="text-lg mt-2 text-gray-500 font-light">
        Once the transaction is confirmed, the NFT will be sent to your wallet
        instantly.
      </div>
      <div className="flex items-center mt-4 ">
        <div className="bg-gray-100 w-full rounded-l-md h-12 px-4 text-xl font-light focus:outline-none flex items-center">
          {ethers.utils.formatEther(edition?.price.toString() || "0")}
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

  return (
    <Layout>
      <div className="flex relative">
        <div className="w-1/2 border-r flex items-center justify-around h-[100vh] px-6">
          <div>
            {(edition?.media || nftPreview) && (
              <NFTRenderer
                nft={
                  edition?.media
                    ? {
                        metadata: {
                          imageUri: edition?.media?.image?.uri,
                          contentUri: edition?.media?.content?.uri,
                        },
                        rawData: {},
                      }
                    : nftPreview!
                }
                renderingContext="FULL"
                className="object-contain max-h-[70vh] w-auto shadow-2xl"
              />
            )}
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-around h-[100vh]">
          {success ? successControl : buyControl}
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
