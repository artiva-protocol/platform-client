import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { ArtivaContext, HomeProps } from "@artiva/shared";
import { useContext, useState } from "react";

export default function Test() {
  const [url, setURL] = useState<string | undefined>();
  const HomeDynamic = useThemeComponent<HomeProps>({
    themeURL: `${url}/remoteEntry.js`,
    component: "./Home",
  });
  const ctx = useContext(ArtivaContext);
  return (
    <div>
      <input
        className="bg-gray-100 w-3/4"
        value={url}
        onChange={(e) => setURL(e.target.value)}
      />
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
