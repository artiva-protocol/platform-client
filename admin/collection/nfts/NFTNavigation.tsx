import {
  ChevronLeftIcon,
  CreditCardIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import CurateNavElement from "../shared/CurateNavElement";
import CurateWallet from "./NFTWallet";
import CurateAsset from "./NFTAsset";

const NFTNavigation = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("wallet");

  return (
    <div className="border-r h-screen relative" style={{ width: "450px" }}>
      <button
        onClick={() => {
          router.back();
        }}
        className="flex items-center px-8 pt-8"
      >
        <ChevronLeftIcon className="w-4 mr-1" />
        <div className="text-sm text-gray-700">Collection</div>
      </button>
      <div className="mt-12 overflow-y-auto" style={{ height: "74vh" }}>
        <div className="font-semibold px-8 ">Curate from</div>

        <CurateNavElement
          navId="wallet"
          title="Wallet"
          icon={<CreditCardIcon className="w-4 text-gray-600" />}
          selected={selected}
          setSelected={setSelected}
        />
        {selected === "wallet" && <CurateWallet />}

        <CurateNavElement
          navId="asset"
          title="Contract / Token ID"
          icon={<DocumentIcon className="w-4 text-gray-600" />}
          selected={selected}
          setSelected={setSelected}
        />
        {selected === "asset" && <CurateAsset />}
      </div>
    </div>
  );
};

export default NFTNavigation;
