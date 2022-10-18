import useAxios from "@/hooks/axios/useAxios";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { Platform } from "@artiva/shared";
import { Site } from "@prisma/client";
import AppHeader from "app/Header";
import PlatformPlacard from "app/PlatformPlacard";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ platform: string }>
): Promise<GetStaticPropsResult<{ platform: Platform }>> => {
  const { platform: platformContract } = context.params!;
  const platform = await getPlatformMetadataByPlatform(platformContract);

  if (!platform) return { notFound: true };

  return {
    props: {
      platform,
    },
    revalidate: 60,
  };
};

const PlatformIndex = ({
  platform,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { platform: platformContract } = router.query;
  const { data: siteData } = useSWR<Site>(
    `/api/platform/${platformContract}/deployments`
  );
  const [data, setData] = useState<Partial<Site> | undefined>();

  const { send, loading } = useAxios({
    url: `/api/platform/${platformContract}/deployments`,
    data: {
      subdomain: data?.subdomain,
    },
  });

  useEffect(() => {
    if (data || !siteData) return;
    setData(siteData);
  }, [data, siteData]);

  const onSave = () => {
    send();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <AppHeader />
      <div className="p-2 px-10 bg-white flex items-center justify-start w-full border-b">
        <div className="flex">
          <div className="mr-6 text-black font-bold">Platform</div>
          <a
            href={`http://${platformContract}.localhost:3000/artiva`}
            className="mr-6 text-gray-600"
          >
            Settings
          </a>
          <a
            className="text-gray-600"
            href={`http://${platformContract}.localhost:3000`}
          >
            Visit
          </a>
        </div>
      </div>
      <div className="flex h-[83vh]">
        <div className="flex items-center justify-around w-1/2 border-r border-gray-300">
          <div className="w-full h-full">
            <PlatformPlacard
              rounding={false}
              platform={{ ...platform, contract: platformContract as string }}
            />
          </div>
        </div>
        <div className="flex items-center justify-around w-1/2 text-left">
          <div className="w-[35vw]">
            <div className="text-3xl font-bold">Platform Deployments</div>
            <div className="mt-1 text-gray-500">
              Onchain and offchain deployments for your platform
            </div>

            <div className="mt-8 text-gray-700">Contract</div>
            <div className="w-full mt-1 px-3 h-8 flex items-center justify-start text-gray-400 bg-white rounded-md">
              {platformContract}
            </div>

            <div className="mt-6 text-gray-700">Subdomain</div>
            <div className="flex items-center mt-2">
              <input
                className="w-full px-3 h-8 border-r focus:outline-none rounded-l-md"
                placeholder="test"
                value={data?.subdomain || ""}
                onChange={(e) => {
                  setData((x) => ({ ...x, subdomain: e.target.value }));
                }}
              />
              <div className="bg-white text-gray-400 h-8 flex items-center justify-around w-40 rounded-r-md">
                .myartiva.xyz
              </div>
            </div>

            <div className="mt-6 text-gray-700">Custom Domain</div>
            <div className="flex items-center mt-2">
              <input
                disabled
                className="w-full px-3 h-8 border-r focus:outline-none rounded-md bg-white"
                placeholder="Coming soon"
              />
            </div>
            <div className="w-full flex items-center justify-around mt-8">
              <button
                onClick={onSave}
                className="bg-black w-full text-white h-10 rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformIndex;
