import AdminLayout from "@/admin/AdminLayout";
import {
  RectangleStackIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const Collection = () => {
  const router = useRouter();
  const push = (key: string) => {
    router.push("/artiva/collection/" + key);
  };

  return (
    <AdminLayout>
      <div className="p-6 px-10">
        <h1 className="text-3xl font-bold">Collection</h1>
        <div className="mt-10 w-full">
          <h2 className="text-xs text-gray-500 font-semibold border-b pb-1 w-full">
            MANAGE
          </h2>
          <div className="mt-6 gap-14 grid grid-cols-3">
            <button
              className="flex"
              onClick={() => {
                push("manage");
              }}
            >
              <div className="flex-none bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-around">
                <Cog6ToothIcon className="w-5 text-white" />
              </div>
              <div className="ml-4 mt-1 text-left">
                <h3 className="font-semibold text-gray-700">
                  Manage Collection
                </h3>
                <p className="text-sm text-gray-400">
                  Edit or delete collection items
                </p>
              </div>
            </button>

            <button
              className="flex"
              onClick={() => {
                push("nfts");
              }}
            >
              <div className="flex-none bg-blue-500 w-10 h-10 rounded-full flex items-center justify-around">
                <DocumentDuplicateIcon className="w-5 text-white" />
              </div>
              <div className="ml-4 mt-1 text-left">
                <h3 className="font-semibold text-gray-700">Add NFTs</h3>
                <p className="text-sm text-gray-400">Curate Individual NFTs</p>
              </div>
            </button>

            <button
              className="flex"
              onClick={() => {
                push("contracts");
              }}
            >
              <div className="flex-none bg-green-500 w-10 h-10 rounded-full flex items-center justify-around">
                <RectangleStackIcon className="w-5 text-white" />
              </div>
              <div className="ml-4 mt-1 text-left">
                <h3 className="font-semibold text-gray-700">Add Contracts</h3>
                <p className="text-sm text-gray-400">Curate NFT contracts</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Collection;
