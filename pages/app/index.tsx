import {
  getPlatformsByUser,
  GetPlatformsResponse,
} from "@/services/platform-graph";
import useSWR from "swr";
import { useAccount } from "wagmi";
import AppHeader from "app/Header";
import Link from "next/link";
import PlatformPlacard from "app/PlatformPlacard";
import useUser from "@/hooks/auth/useUser";
import { Fragment } from "react";

const AppIndex = () => {
  const {
    user: { address },
    status,
  } = useUser();

  const { data } = useSWR<GetPlatformsResponse[]>(
    address ? ["platforms", address] : undefined,
    (_, userAddress) => {
      return getPlatformsByUser(userAddress);
    }
  );

  return (
    <div className=" bg-gray-100 min-h-screen pb-10">
      <AppHeader />
      {status !== "loading" && (
        <Fragment>
          {(!address || data?.length == 0) && (
            <div className="flex items-center justify-around w-full h-[80vh]">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-semibold">No platforms found</div>
                <Link href="/create">
                  <a className="bg-black flex items-center justify-around text-white h-8 w-[20vw] rounded-md mt-4">
                    Create my Platform
                  </a>
                </Link>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-6 px-20 pt-6">
            {data?.map((x) => (
              <Link href={`platform/${x.contract}`} key={x.contract}>
                <a className="h-[30vh]">
                  <PlatformPlacard platform={x} />
                </a>
              </Link>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default AppIndex;
