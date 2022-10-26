import AdminLayout from "@/admin/AdminLayout";
import NFTHeader from "@/admin/collection/nfts/NFTHeader";
import CuratorContext from "@/context/CuratorContext";
import NFTFilterContext, {
  NFTFilterSearchType,
} from "@/context/NFTFilterContext";
import { Fragment } from "react";
import TokensFeed from "@/admin/collection/Feed/Feeds/TokensFeed";
import MintsFeed from "@/admin/collection/Feed/Feeds/MintsFeed";

const NFTs = () => {
  return (
    <CuratorContext.Provider>
      <NFTFilterContext.Provider>
        <div className="relative">
          <AdminLayout>
            <div className="p-6 px-10">
              <NFTHeader title="Curate NFTs" />
              <div className="border border-gray-100 mt-4 shadow-xl overflow-y-auto h-[80vh]">
                <NFTFeedWrapper />
              </div>
            </div>
          </AdminLayout>
        </div>
      </NFTFilterContext.Provider>
    </CuratorContext.Provider>
  );
};

const NFTFeedWrapper = () => {
  const { filter } = NFTFilterContext.useContainer();
  return filter.searchType === NFTFilterSearchType.MINTED ? (
    <MintsFeed />
  ) : (
    <TokensFeed />
  );
};

export default NFTs;
