import { ArtivaContext, HomeProps } from "@artiva/shared";
import { useContext } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { injectScript } from "@module-federation/nextjs-mf/utils/index";

export default function Test() {
  const HomeDynamic = dynamic<HomeProps>(
    () => {
      return injectScript({
        global: "baseline:0.0.1",
        url: "https://arweave.net/RpXiqGOn-k80jdQUsy8tegFQ6ZaFhZ0HxrsFyUiDrJE/remoteEntry.js",
        uniqueKey: "0",
      })
        .then((_: any) => (window as any)["baseline:0.0.1"].get("./Home"))
        .then((factory: any) => factory());
    },
    {
      ssr: false,
      suspense: false,
    }
  );

  const Home2Dynamic = dynamic<HomeProps>(
    () => {
      return injectScript({
        global: "subtle",
        url: "https://arweave.net/ialglCkXIErspijPs5sw4JSUfZWGfl83ih_3N8XYDGY/remoteEntry2.js",
        uniqueKey: "1",
      })
        .then((_: any) => (window as any)["subtle"].get("./Home2"))
        .then((factory: any) => factory());
    },
    {
      ssr: false,
      suspense: false,
    }
  );

  const ctx = useContext(ArtivaContext);
  return (
    <div>
      <Link href={"/test2"}>
        <a>Test 2</a>
      </Link>
      <HomeDynamic
        ctx={ctx}
        platform={{
          title: "Artiva Test",
          description: "This is test",
          custom: {},
        }}
      />
      <Home2Dynamic
        ctx={ctx}
        platform={{
          title: "Artiva Test 2",
          description: "This is test 2",
          custom: {},
        }}
      />
    </div>
  );
}
