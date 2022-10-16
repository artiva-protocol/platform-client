import AdminLayout from "@/admin/AdminLayout";
import CuratorContext from "@/context/CuratorContext";
import NFTContractContext from "@/context/NFTContractContext";
import NFTContractHeader from "@/admin/collection/nftContracts/NFTContractHeader";
import NFTContractView from "@/admin/collection/nftContracts/NFTContractView";
import { Fragment } from "react";

const NFTContracts = () => {
  return (
    <CuratorContext.Provider>
      <NFTContractContext.Provider>
        <div className="relative">
          <AdminLayout>
            <div className="p-6 px-10">
              <NFTContractHeader title="Curate NFT Contracts" />
              <div className="border border-gray-100 mt-4 shadow-xl overflow-y-auto h-[80vh]">
                <NFTContractViewWrapper />
              </div>
            </div>
          </AdminLayout>
        </div>
      </NFTContractContext.Provider>
    </CuratorContext.Provider>
  );
};

const NFTContractViewWrapper = () => {
  const { data } = NFTContractContext.useContainer();
  return data ? <NFTContractView contract={data} /> : <Fragment />;
};

export default NFTContracts;
