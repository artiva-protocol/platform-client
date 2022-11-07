import {
  Layout,
  NFTRenderer,
  useMarket,
  IMarketAdapter,
  ChainIdentifier,
  useNFT,
} from "@artiva/shared";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { useAccount, useSigner } from "wagmi";
import ConnectWallet from "@/components/market/ConnectWallet";
import BackButton from "@/components/market/BackButton";
import {
  AuctionLike,
  MARKET_INFO_STATUSES,
  MARKET_TYPES,
} from "@zoralabs/nft-hooks/dist/types";
import { useState } from "react";
import { ethers } from "ethers";
import CustomConnectButton from "@/components/CustomConnectButton";
import WalletWrapper from "@/components/WalletWrapper";

const Buy = () => {
  const router = useRouter();
  const { chain, contract, tokenid } = router.query;
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: nft } = useNFT({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
    tokenId: tokenid as string,
  });

  const market = useMarket(nft) as IMarketAdapter | undefined;

  const ask = useMemo(
    () =>
      nft?.markets?.find(
        (x) =>
          x.type === MARKET_TYPES.FIXED_PRICE &&
          x.status === MARKET_INFO_STATUSES.ACTIVE
      ),
    [nft?.markets]
  ) as AuctionLike | undefined;

  if (!nft || !ask) return <Fragment />;

  const onBuyNow = async () => {
    setLoading(true);
    setError("");
    if (!signer || !market || !nft) return;

    market.connect(signer, chain as ChainIdentifier);

    try {
      const res = await market.fillAsk(nft, ethers.constants.AddressZero);
      if (typeof res === "object" && "wait" in res) {
        await res.wait();
      }
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
      <div className="sm:w-2/3">
        <div className="text-3xl sm:text-4xl font-semibold">Buy Now</div>
        <div className="sm:text-lg mt-2 text-gray-500 font-light">
          Once the transaction is confirmed, the NFT will be sent to your wallet
          instantly.
        </div>
        <div className="flex items-center mt-4 ">
          <div className="bg-gray-100 w-full rounded-l-md h-12 px-4 text-xl font-light focus:outline-none flex items-center">
            {ask.amount?.amount.value}
          </div>
          <div className="px-5 font-semibold bg-gray-200 h-12 flex items-center rounded-r-md">
            {ask.amount?.symbol}
          </div>
        </div>
        <WalletWrapper className="h-12 w-full bg-black text-white text-lg mt-6 rounded-md">
          <button
            onClick={onBuyNow}
            className="h-12 w-full bg-black text-white text-lg mt-6 rounded-md"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </WalletWrapper>
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
      <div className="flex flex-col sm:flex-row relative">
        <BackButton />
        <div className="absolute top-5 right-5">
          <CustomConnectButton className="w-36 h-8 rounded-md bg-black text-white" />
        </div>
        <div className="sm:w-1/2 border-r flex items-center justify-around sm:h-[100vh] px-6 mt-20 sm:mt-0">
          <div>
            {nft ? (
              <NFTRenderer
                nft={nft}
                renderingContext={"FULL"}
                className="object-scale-down h-[50vh] sm:h-[70vh]"
              />
            ) : (
              <Fragment />
            )}
          </div>
        </div>
        <div className="sm:w-1/2 flex items-center justify-around sm:h-[100vh] px-6 sm:px-0">
          {success ? (
            successControl()
          ) : address ? (
            buyControl()
          ) : (
            <ConnectWallet />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Buy;
