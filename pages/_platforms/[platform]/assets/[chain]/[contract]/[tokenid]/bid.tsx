import {
  Layout,
  NFTRenderer,
  IMarketAdapter,
  useMarket,
  useNFT,
  ChainIdentifier,
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
import { utils } from "ethers";
import CustomConnectButton from "@/components/CustomConnectButton";

const Bid = () => {
  const router = useRouter();
  const { chain, contract, tokenid } = router.query;
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: nft } = useNFT({
    chain: chain as ChainIdentifier,
    contractAddress: contract as string,
    tokenId: tokenid as string,
  });

  const market = useMarket(nft) as IMarketAdapter | undefined;

  const auction = useMemo(
    () =>
      nft?.markets?.find(
        (x) =>
          x.type === MARKET_TYPES.AUCTION &&
          x.status === MARKET_INFO_STATUSES.ACTIVE
      ),
    [nft?.markets]
  ) as AuctionLike | undefined;

  if (!nft || !auction) return <Fragment />;

  const amt = auction.currentBid?.amount.amount.value;
  const priceIncrease = 0.05;
  const min = amt ? amt + amt * priceIncrease : auction.amount?.amount.value!;
  const minString = parseFloat(min.toFixed(4)).toString();

  const onPlaceBid = async () => {
    setLoading(true);
    setError("");
    if (!signer || !market || !nft || !min) return;

    if (parseFloat(bidAmount) < min) {
      setError(
        `Bid must be greater than ${minString} ${auction.amount?.symbol}`
      );
      return;
    }

    const parsedAmount = utils.parseUnits(
      bidAmount,
      auction.amount?.amount.decimals
    );

    market.connect(signer, chain as ChainIdentifier);

    try {
      const res = await market.placeBid(nft, parsedAmount);
      if (typeof res === "object" && "wait" in res) {
        await res.wait();
      }
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
          Bid placed successfully
        </div>
        <div className="text-lg mt-2 text-gray-500 font-light">
          Please wait a few minutes for the bid to index
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

  const bidControl = () => {
    return (
      <div className="w-2/3">
        <div className="text-4xl font-semibold">Place a bid</div>
        <div className="text-lg mt-2 text-gray-500 font-light">
          Once your bid is placed, you will be the highest bidder in the
          auction.
        </div>
        <div className="flex items-center mt-4 ">
          <input
            value={bidAmount}
            onChange={(e) => {
              setBidAmount(e.target.value);
            }}
            className="bg-gray-100 w-full rounded-l-md h-12 px-4 text-xl font-light focus:outline-none"
            placeholder={minString || "0.00"}
          />
          <div className="px-5 font-semibold bg-gray-200 h-12 flex items-center rounded-r-md">
            {auction.amount?.symbol}
          </div>
        </div>
        <button
          onClick={onPlaceBid}
          className="h-12 w-full bg-black text-white text-lg mt-6 rounded-md"
        >
          {loading ? "Placing bid..." : "Place bid"}
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
        <div className="w-1/2 border-r flex items-center justify-around h-[100vh] px-6">
          <div>
            <NFTRenderer
              nft={nft}
              renderingContext={"FULL"}
              className="object-cover h-[70vh] shadow-2xl"
            />
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-around h-[100vh]">
          {success ? (
            successControl()
          ) : address ? (
            bidControl()
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

export default Bid;
