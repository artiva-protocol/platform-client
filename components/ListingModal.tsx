import { useMetadata } from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import ReserviorMarketAdapter from "adapters/markets/reservior/ReserviorMarketAdapter";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { compareAddress } from "utils/compareAddress";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import ModalWrapper from "./ModalWrapper";

const ListingModal = ({
  className,
  nft,
}: {
  className: string;
  nft: NFTObject;
}) => {
  const {
    query: { platform },
  } = useRouter();
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { data: platformData } = useMetadata({ platform: platform as string });
  const { data: signer } = useSigner();
  const network = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const market = useMemo(() => {
    return ReserviorMarketAdapter;
  }, []);

  const isOwner = useMemo(() => {
    if (!address || !nft.nft?.owner?.address) return false;
    return compareAddress(address, nft.nft?.owner?.address);
  }, [address, nft.nft?.owner?.address]);

  if (!platformData?.marketFee || !isOwner) return <Fragment />;

  const onList = async () => {
    if (!signer) return;
    market.connect(signer, "ETHEREUM", platformData.marketFee);
    const res = await market.createAsk(nft, amount);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className={className}>
        List NFT
      </button>

      <ModalWrapper open={open} setOpen={setOpen}>
        <div className="text-2xl font-semibold">List for sale</div>

        <div className="mt-4 text-gray-600">Price</div>
        <div className="flex">
          <input
            className="bg-gray-100 w-full rounded-l-md p-1 px-4 focus:outline-none"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.5"
            value={amount}
          />
          <div className="px-2 h-10 bg-gray-200 flex items-center justify-around rounded-r-md">
            ETH
          </div>
        </div>

        <div className="mt-2">Platform fee</div>
        <div className="bg-gray-100 flex items-center w-full rounded-md p-1 px-4 text-gray-500 h-10">
          {platformData.marketFee.feeBPS / 1000} %
        </div>

        {network.chain?.unsupported ? (
          <button
            onClick={() => switchNetwork && switchNetwork(1)}
            className="w-full bg-black text-white h-10 mt-6 rounded-md"
          >
            Switch to Mainnet
          </button>
        ) : (
          <button
            onClick={onList}
            className="w-full bg-black text-white h-10 mt-6 rounded-md"
          >
            List NFT
          </button>
        )}
      </ModalWrapper>
    </div>
  );
};

export default ListingModal;
