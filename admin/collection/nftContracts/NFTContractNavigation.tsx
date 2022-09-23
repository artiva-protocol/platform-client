import { ChevronLeftIcon, RectangleStackIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import CurateNavElement from "../shared/CurateNavElement";
import NFTContractAddress from "./NFTContractAddress";

const NFTContractNavigation = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("address");

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
          navId="address"
          title="Address"
          icon={<RectangleStackIcon className="w-4 text-gray-600" />}
          selected={selected}
          setSelected={setSelected}
        />
        {selected === "address" && <NFTContractAddress />}
      </div>
    </div>
  );
};

export default NFTContractNavigation;
