import useSWR from "swr";

export type CurrentPlatformType = {
  address: string;
};

const useCurrentPlatform = () => {
  return useSWR<CurrentPlatformType>(
    process.env.NEXT_PUBLIC_SERVER_BASEURL + "/platform/address"
  );
};

export default useCurrentPlatform;
