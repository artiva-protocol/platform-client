import PlatformHeader from "app/PlatformHeader";
import { useEffect, useState } from "react";

import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { useRouter } from "next/router";
import PlatformPlacard from "app/PlatformPlacard";
import { Platform } from "@artiva/shared";
import useAxios from "@/hooks/axios/useAxios";
import useSWR from "swr";
import { Site } from "@prisma/client";

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

const PlatformDomains = ({
  platform,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    query: { platform: platformContract },
  } = useRouter();
  const [subdomain, setSubdomain] = useState<string | undefined>();
  const { data } = useSWR<Site>(
    `/api/platform/${platformContract}/deployments`
  );

  useEffect(() => {
    if (!subdomain && data?.subdomain) setSubdomain(data.subdomain!);
  }, [subdomain, data]);

  const { send, loading } = useAxios({
    url: `/api/platform/${platformContract}/deployments`,
    data: {
      subdomain,
    },
  });

  return (
    <div className="bg-gray-100 h-[100vh]">
      <PlatformHeader />
      <div className="flex h-[83vh]">
        <div className="flex items-center justify-around w-1/2 text-left">
          <div className="w-[35vw]">
            <div className="text-3xl font-bold">Domain Settings</div>
            <div className="mt-1 text-gray-500">
              Edit domains for your platform
            </div>

            <div className="mt-8 text-sm">Subdomain</div>
            <div className="flex items-center mt-1">
              <input
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                className="w-full rounded-l-md px-3 h-8 focus:outline-none border-r"
                placeholder="mysite"
              />
              <div className="bg-white text-gray-500 rounded-r-md px-6 h-8 flex items-center">
                .{process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
              </div>
            </div>
            <button
              onClick={send}
              className="bg-black text-white w-full mt-6 h-8 rounded-md"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-around w-1/2">
          <a
            href={`http://${platformContract}.localhost:3000`}
            className="w-[45vw] h-[60vh] shadow-xl"
          >
            <PlatformPlacard
              preview={true}
              platform={{ ...platform, contract: platformContract as string }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlatformDomains;
