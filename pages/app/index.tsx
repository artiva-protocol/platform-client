import {
  getPlatformsByUser,
  GetPlatformsResponse,
} from "@/services/platform-graph";
import useSWR from "swr";
import { useAccount } from "wagmi";
import AppHeader from "app/Header";
import Link from "next/link";
import PlatformPlacard from "app/PlatformPlacard";

const AppIndex = () => {
  const { address } = useAccount();

  const { data } = useSWR<GetPlatformsResponse[]>(
    address ? ["platforms", address] : undefined,
    (_, userAddress) => {
      return getPlatformsByUser(userAddress);
    }
  );

  return (
    <div className=" bg-gray-100 min-h-screen">
      <AppHeader />
      <div className="grid grid-cols-3 gap-6 px-20 pt-6">
        {data?.map((x) => (
          <Link href={`platform/${x.contract}`} key={x.contract}>
            <a className="h-[30vh]">
              <PlatformPlacard platform={x} />
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppIndex;
