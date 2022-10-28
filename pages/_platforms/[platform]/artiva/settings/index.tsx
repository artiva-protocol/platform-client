import AdminLayout from "@/admin/AdminLayout";
import MetadataSaveButton from "@/admin/MetadataSaveButton";
import {
  CogIcon,
  SparklesIcon,
  ChevronDoubleUpIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const Settings = () => {
  const router = useRouter();
  const push = (key: string) => {
    router.push("/artiva/settings/" + key);
  };

  return (
    <AdminLayout>
      <div className="p-6 px-10">
        <div className="flex justify-between items-baseline relative">
          <div className="flex items-baseline">
            <div className="text-3xl font-bold">Settings</div>
          </div>
          <MetadataSaveButton />
        </div>
        <div className="mt-10 w-full">
          <h2 className="text-xs text-gray-500 font-semibold border-b pb-1 w-full">
            WEBSITE
          </h2>
          <div className="mt-6 gap-14 grid grid-cols-3">
            <button
              className="flex"
              onClick={() => {
                push("general");
              }}
            >
              <div className="flex-none bg-green-500 w-10 h-10 rounded-full flex items-center justify-around">
                <CogIcon className="w-5 text-white" />
              </div>
              <div className="ml-4 mt-1 text-left">
                <h3 className="font-semibold text-gray-700">General</h3>
                <p className="text-sm text-gray-400">
                  Basic site details and metadata settings
                </p>
              </div>
            </button>

            <button
              className="flex"
              onClick={() => {
                push("design");
              }}
            >
              <div className="flex-none bg-blue-500 w-10 h-10 rounded-full flex items-center justify-around">
                <SparklesIcon className="w-5 h-6 text-white" />
              </div>
              <div className="ml-4 mt-1 text-left">
                <h3 className="font-semibold text-gray-700">Design</h3>
                <p className="text-sm text-gray-400">
                  Customize your site and manage themes
                </p>
              </div>
            </button>

            <button
              className="flex"
              onClick={() => {
                push("navigation");
              }}
            >
              <div className="flex-none bg-red-500 w-10 h-10 rounded-full flex items-center justify-around">
                <ChevronDoubleUpIcon className="w-5 text-white" />
              </div>
              <div className="ml-4 mt-1 text-left">
                <h3 className="font-semibold text-gray-700">Navigation</h3>
                <p className="text-sm text-gray-400">
                  Set up primary and secondary menus
                </p>
              </div>
            </button>
          </div>
          <div className="mt-24 w-full">
            <h2 className="text-xs text-gray-500 font-semibold border-b pb-1 w-full">
              COLLECTION
            </h2>
            <div className="mt-6 gap-14 grid grid-cols-3">
              <button
                className="flex"
                onClick={() => {
                  push("reorder");
                }}
              >
                <div className="flex-none bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-around">
                  <CogIcon className="w-5 text-white" />
                </div>
                <div className="ml-4 mt-1 text-left">
                  <h3 className="font-semibold text-gray-700">Reorder</h3>
                  <p className="text-sm text-gray-400">
                    Change ordering for content published on your site
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
