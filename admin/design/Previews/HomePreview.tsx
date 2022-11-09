import DesignerContext from "@/context/DesignerContext";
import { useContext } from "react";
import { Fragment } from "react";
import { Layout, ArtivaContext, HomeProps } from "@artiva/shared";
import useThemeComponent from "@/hooks/theme/useThemeComponent";
import { useRouter } from "next/router";
import useThemeURL from "@/hooks/theme/useThemeURL";

const HomePreview = () => {
  const ctx = useContext(ArtivaContext);
  const { data: designerData } = DesignerContext.useContainer();
  const {
    query: { platform },
  } = useRouter();

  const themeURL = useThemeURL({ theme: designerData?.themeURL });

  const HomeDynamic = useThemeComponent<HomeProps>({
    component: "./Home",
    themeURL,
  });

  if (!HomeDynamic || !designerData) return <Fragment />;

  return (
    <Layout>
      <HomeDynamic
        ctx={ctx}
        platform={{ ...designerData, id: platform as string }}
      />
    </Layout>
  );
};

export default HomePreview;
