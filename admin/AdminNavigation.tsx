import {
  CogIcon,
  RectangleStackIcon,
  LockClosedIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import useSignOut from "hooks/auth/useSignOut";
import { useRouter } from "next/router";
import { CustomConnectButton } from "@artiva/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const AdminNavigation = () => {
  const router = useRouter();
  const { signOut } = useSignOut();

  const getStyle = (key: string) => {
    return router.pathname.includes(key)
      ? "font-bold text-black"
      : "font-light text-gray-400";
  };

  const push = (key: string) => {
    router.push("/artiva/" + key, undefined, { shallow: true });
  };

  return (
    <div className="p-8 border-r h-screen relative" style={{ width: "400px" }}>
      <div className="flex items-center">
        <img src="/artiva-logo.svg" className="w-7 mr-4" />
        <div className="text-sm font-semibold text-gray-700">Neos Artworks</div>
      </div>
      <div className="mt-10">
        <button onClick={() => push("site")} className="flex items-center mt-4">
          <HomeIcon className="mr-4 w-5 text-gray-400" />
          <div className={`text-sm text-gray-600 ${getStyle("site")}`}>
            View Site
          </div>
        </button>

        <button
          onClick={() => push("collection")}
          className="flex items-center mt-4"
        >
          <RectangleStackIcon className="mr-4 w-5 text-gray-400" />
          <div className={`text-sm text-gray-600 ${getStyle("collection")}`}>
            Collection
          </div>
        </button>

        <button
          onClick={() => push("settings")}
          className="flex items-center mt-4"
        >
          <CogIcon className="mr-4 w-5 text-gray-400" />
          <div className={`text-sm text-gray-600 ${getStyle("settings")}`}>
            Settings
          </div>
        </button>

        <button onClick={signOut} className="flex items-center mt-8">
          <LockClosedIcon className="mr-4 w-5 text-gray-400 " />
          <div className={`text-sm text-gray-600 font-light text-gray-400`}>
            Log Out
          </div>
        </button>
      </div>
      <div className="absolute bottom-4 left-6">
        <ConnectButton.Custom>
          {(props) => (
            <CustomConnectButton
              {...props}
              className="flex item-center justify-around border border-gray-400 text-gray-500 w-40 rounded-md text-center"
            />
          )}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default AdminNavigation;
