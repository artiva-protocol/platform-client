import {
  CogIcon,
  RectangleStackIcon,
  HomeIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { CustomConnectButton, useMetadata } from "@artiva/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/future/image";

const AdminNavigation = () => {
  const router = useRouter();
  const { data } = useMetadata({ platform: router.query.platform as string });

  const getStyle = (key: string) => {
    return router.pathname.includes(key)
      ? "font-bold text-black"
      : "font-light text-gray-400";
  };

  return (
    <div className="p-8 border-r h-screen relative" style={{ width: "400px" }}>
      <div className="flex items-center">
        <Image
          alt="logo"
          src="/artiva-logo.svg"
          className="w-7 mr-4"
          width={20}
          height={20}
        />
        <div className="text-sm font-semibold text-gray-700">{data?.title}</div>
      </div>
      <div className="mt-10">
        <Link href={"/artiva/site"}>
          <a className="flex items-center mt-4">
            <HomeIcon className="mr-4 w-5 text-gray-400" />
            <div className={`text-sm text-gray-600 ${getStyle("site")}`}>
              View Site
            </div>
          </a>
        </Link>

        <Link href={"/artiva/collection"}>
          <a className="flex items-center mt-4">
            <RectangleStackIcon className="mr-4 w-5 text-gray-400" />
            <div className={`text-sm text-gray-600 ${getStyle("collection")}`}>
              Collection
            </div>
          </a>
        </Link>

        <Link href={"/artiva/settings"}>
          <a className="flex items-center mt-4">
            <CogIcon className="mr-4 w-5 text-gray-400" />
            <div className={`text-sm text-gray-600 ${getStyle("settings")}`}>
              Settings
            </div>
          </a>
        </Link>

        <Link href={"/artiva/staff"}>
          <a className="flex items-center mt-4">
            <CheckBadgeIcon className="mr-4 w-5 text-gray-400" />
            <div className={`text-sm text-gray-600 ${getStyle("staff")}`}>
              Staff
            </div>
          </a>
        </Link>
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
