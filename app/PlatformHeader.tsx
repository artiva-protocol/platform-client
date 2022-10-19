import { useRouter } from "next/router";
import { Fragment } from "react";
import AppHeader from "./Header";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

const PlatformHeader = () => {
  const {
    query: { platform },
    pathname,
  } = useRouter();

  return (
    <Fragment>
      <AppHeader />
      <div className="p-2 px-10 bg-white flex items-center justify-start w-full border-b">
        <div className="flex">
          <Link href={`/platform/${platform}`}>
            <a
              className={`mr-6 ${
                !pathname.includes("domains") ? "text-black font-bold" : ""
              }`}
            >
              Platform
            </a>
          </Link>
          <Link href={`/platform/${platform}/domains`}>
            <a
              className={`mr-6 ${
                pathname.includes("domains") ? "text-black font-bold" : ""
              } `}
            >
              Domains
            </a>
          </Link>
          <a
            href={`http://${platform}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/artiva`}
            className="mr-6 text-gray-600 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="mr-1">Settings</div>
            <ArrowTopRightOnSquareIcon className="h-4" />
          </a>
          <a
            className="text-gray-600 flex items-center"
            href={`http://${platform}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="mr-1">Vist</div>
            <ArrowTopRightOnSquareIcon className="h-4" />
          </a>
        </div>
      </div>
    </Fragment>
  );
};

export default PlatformHeader;
