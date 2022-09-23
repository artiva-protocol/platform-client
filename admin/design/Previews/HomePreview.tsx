import DesignerContext from "@/context/DesignerContext";
import { useContext } from "react";
import { Fragment } from "react";
import { Layout, ArtivaContext, HomeProps } from "@artiva/shared";
import useThemeComponent from "@/hooks/theme/useThemeComponent";

const HomePreview = () => {
  const ctx = useContext(ArtivaContext);
  const { data: designerData } = DesignerContext.useContainer();

  const themeURL =
    designerData?.themeURL || process.env.NEXT_PUBLIC_BASE_THEME_URL;

  const HomeDynamic = useThemeComponent<HomeProps>({
    component: "./Home",
    themeURL: themeURL + "/remoteEntry.js",
  });

  if (!HomeDynamic || !designerData) return <Fragment />;

  return (
    <Layout>
      <HomeDynamic ctx={ctx} platform={designerData} />
    </Layout>
  );
};

export default HomePreview;
