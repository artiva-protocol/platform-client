import { PrismaClient } from "@prisma/client";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { Fragment, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export function getStaticPaths(): GetStaticPathsResult {
  return {
    paths: [],
    fallback: "blocking",
  };
}

//Lookup the contract for the subdomain and set the cookie to use in middleware
export async function getStaticProps(
  context: GetStaticPropsContext<{ platform: string }>
): Promise<GetStaticPropsResult<{ contract: string }>> {
  const { platform } = context.params!;
  const primsa = new PrismaClient();
  const contract = await primsa.site
    .findFirst({ where: { subdomain: platform as string } })
    .then((x) => x?.contract);

  if (!contract) return { notFound: true };

  return {
    props: {
      contract,
    },
    revalidate: 86400, //24 hours
  };
}

const Generate = ({
  contract,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { platform } = router.query;

  //Route back to middleware so we can use the cookie to route to the correct path
  useEffect(() => {
    Cookies.set(platform as string, contract, {
      expires: 1, //Keep cookie for 1 day
    });
    const redirectTo = Cookies.get(`${platform}:redirectTo`);
    router.push(redirectTo || "/");
  }, [contract, platform, router]);

  return <Fragment />;
};

export default Generate;
