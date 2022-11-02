import useAxios from "@/hooks/axios/useAxios";
import { getPlatformMetadataByPlatform } from "@/services/platform-graph";
import { Platform } from "@artiva/shared";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { Site } from "@prisma/client";
import PlatformHeader from "app/PlatformHeader";
import PlatformPlacard from "app/PlatformPlacard";
import { BLOCK_EXPLORER_BY_NETWORK } from "constants/urls";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { compareAddress } from "utils/compareAddress";

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

export type PlatformSelectionType = "platform" | "domain";

const PlatformIndex = ({
  platform,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [selected, setSelected] = useState<PlatformSelectionType>("platform");

  return (
    <div className="bg-gray-100 min-h-screen">
      <PlatformHeader selected={selected} setSelected={setSelected} />
      {selected === "domain" ? (
        <PlatformDomains platform={platform} />
      ) : (
        <PlatformData platform={platform} />
      )}
    </div>
  );
};

const PlatformData = ({ platform }: { platform: Platform }) => {
  const router = useRouter();
  const { platform: platformContract } = router.query;
  const { data: deployments } = useSWR<Site>(
    `/api/platform/${platformContract}/deployments`
  );

  return (
    <div className="flex h-[83vh]">
      <div className="flex items-center justify-around w-1/2 text-left">
        <div className="w-[35vw]">
          <div className="text-3xl font-bold">Platform Deployments</div>
          <div className="mt-1 text-gray-500">
            Onchain and offchain deployments for your platform
          </div>

          <div className="bg-white rounded-md mt-5 text-sm">
            <a
              href={`${
                BLOCK_EXPLORER_BY_NETWORK[
                  process.env.NEXT_PUBLIC_PROTOCOL_NETWORK!
                ]
              }/address/${platformContract}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between mx-2 py-2 border-b"
            >
              <div className="text-gray-500">Contract</div>
              <div className="flex items-center">
                <div className="w-full px-3 h-10 flex items-center justify-start text-gray-700 rounded-md">
                  {`${platformContract?.slice(
                    0,
                    6
                  )}...${platformContract?.slice(
                    platformContract.length - 6,
                    platformContract.length
                  )}`}
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-full text-gray-500" />
              </div>
            </a>

            <a
              aria-disabled={!deployments?.subdomain}
              href={`http://${deployments?.subdomain}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between mx-2 py-2 border-b text-sm ${
                deployments?.subdomain ? "" : "pointer-events-none"
              }`}
            >
              <div className="text-gray-500">Subdomain</div>
              <div className="flex items-center">
                <div className="w-full px-3 h-10 flex items-center justify-start text-gray-700 rounded-md">
                  {deployments?.subdomain
                    ? `${deployments?.subdomain}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`
                    : "None"}
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-full text-gray-500" />
              </div>
            </a>

            <div className="flex items-center justify-between mx-2 py-2">
              <div className="text-gray-500">Custom Domain</div>
              <div className="flex items-center">
                <div className="w-full px-3 h-10 flex items-center justify-start text-gray-700 rounded-md">
                  None
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-full text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around w-1/2 border-r border-gray-300">
        <a
          href={`http://${platformContract}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`}
          className="w-[45vw] h-[60vh] shadow-xl"
        >
          <PlatformPlacard
            preview={true}
            platform={{ ...platform, contract: platformContract as string }}
          />
        </a>
      </div>
    </div>
  );
};

const PlatformDomains = ({ platform }: { platform: Platform }) => {
  const {
    query: { platform: platformContract },
  } = useRouter();
  const [subdomain, setSubdomain] = useState<string | undefined>();
  const { data: site } = useSWR<Site>(
    `/api/platform/${platformContract}/deployments`
  );

  const {
    send: checkSubdomain,
    result: duplicateSite,
    loading: loadingSubdomainCheck,
  } = useAxios<Site>({
    url: `/api/sites?subdomain=${subdomain}`,
  });

  const valid =
    !duplicateSite ||
    compareAddress(duplicateSite.contract, platformContract as string);

  const { send: saveDeployments, loading } = useAxios({
    url: `/api/platform/${platformContract}/deployments`,
    data: {
      subdomain,
    },
  });

  useEffect(() => {
    if (!subdomain && site?.subdomain) setSubdomain(site.subdomain!);
  }, [subdomain, site]);

  useEffect(() => {
    if (!subdomain) return;

    const delayDebounceFn = setTimeout(() => {
      checkSubdomain();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [subdomain, checkSubdomain]);

  return (
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
            disabled={!subdomain || loadingSubdomainCheck || !valid}
            onClick={saveDeployments}
            className={`${
              valid ? "bg-black" : "bg-gray-600"
            } text-white w-full mt-6 h-8 rounded-md`}
          >
            {!valid ? "Subdomain taken" : loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-around w-1/2">
        <a
          href={`http://${platformContract}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`}
          className="w-[45vw] h-[60vh] shadow-xl"
        >
          <PlatformPlacard
            preview={true}
            platform={{ ...platform, contract: platformContract as string }}
          />
        </a>
      </div>
    </div>
  );
};

export default PlatformIndex;
