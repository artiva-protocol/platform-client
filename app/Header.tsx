import ArtivaConnectButton from "@/components/ArtivaConnectButton";
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/future/image";
import Link from "next/link";
import { Fragment } from "react";

const AppHeader = () => {
  return (
    <Fragment>
      <div className="flex justify-between items-center h-20 px-8 bg-white">
        <Link href="/">
          <a className="flex items-center">
            <Image
              src={"/text-logo.svg"}
              className="h-full"
              alt="logo"
              width="120"
              height="50"
            />
          </a>
        </Link>
        <div className="flex items-center">
          <Link href={"/create"}>
            <a className="flex items-center mr-8 text-gray-800">
              <PlusIcon className="h-4 mr-2 text-gray-800" />
              Create
            </a>
          </Link>
          <ArtivaConnectButton className="flex item-center justify-around border border-gray-400 text-gray-500 w-40 rounded-md text-center" />
        </div>
      </div>
    </Fragment>
  );
};

export default AppHeader;
