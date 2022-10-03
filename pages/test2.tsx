import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { ArtivaContext, HomeProps } from "@artiva/shared";
import { useContext } from "react";
import Link from "next/link";

export default function Test2() {
  const HomeDynamic = useThemeComponent<HomeProps>({
    themeIdentifier: `subtle:0.0.1@https://arweave.net/PEFeJb1QcjVwGVL1O9x9bcGv0WYn7MB5SlK9JhY5P3g/remoteEntry.js`,
    component: "./Home2",
  });
  const ctx = useContext(ArtivaContext);
  return (
    <div>
      <Link href={"/test"}>
        <a>Test</a>
      </Link>
      <HomeDynamic
        ctx={ctx}
        platform={{
          title: "Artiva Test",
          description: "This is test",
          custom: {},
        }}
      />
    </div>
  );
}
