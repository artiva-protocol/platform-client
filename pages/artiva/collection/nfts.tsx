import AdminLayout from "@/admin/AdminLayout";
import NFTHeader from "@/admin/collection/nfts/NFTHeader";
import NFTFeed from "@/admin/collection/Feed/NFTFeed";
import CuratorContext from "@/context/CuratorContext";
import NFTFeedContext from "@/context/NFTFeedContext";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import NFTLoading from "@/admin/collection/Feed/NFTLoading";

const NFTs = () => {
  return (
    <CuratorContext.Provider>
      <NFTFeedContext.Provider>
        <div className="relative">
          <AdminLayout>
            <div className="p-6 px-10">
              <NFTHeader title="Curate NFTs" />
              <div className="border border-gray-100 mt-4 shadow-xl overflow-y-auto h-[80vh]">
                <NFTFeedWrapper />
              </div>
              <Footer />
            </div>
          </AdminLayout>
        </div>
      </NFTFeedContext.Provider>
    </CuratorContext.Provider>
  );
};

const NFTFeedWrapper = () => {
  const { loading } = NFTFeedContext.useContainer();
  return loading ? <LoadingView /> : <NFTFeed />;
};

const LoadingView = () => {
  return (
    <div className="grid gap-1 grid-cols-5">
      {Array(10)
        .fill("")
        .map((_, i) => {
          return <NFTLoading key={i} />;
        })}
    </div>
  );
};

const Footer = () => {
  const { next, prev, page, filter, loading } = NFTFeedContext.useContainer();
  return (
    <div className="absolute bottom-0 right-9">
      <button onClick={prev} disabled={filter.page === 0}>
        <ArrowLeftCircleIcon
          className={`h-6 mr-2 ${
            filter.page === 0 && !loading ? "text-gray-500" : ""
          }`}
        />
      </button>
      <button onClick={next} disabled={!page?.hasNextPage}>
        <ArrowRightCircleIcon
          className={`h-6 ${
            !page?.hasNextPage && !loading ? "text-gray-500" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default NFTs;
