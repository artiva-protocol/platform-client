import { Fragment } from "react";
import HomePreview from "./HomePreview";

export enum DesignerSitePreviewType {
  HOME = "home",
  POST = "post",
}

const DesignerSitePreview = ({ type }: { type: DesignerSitePreviewType }) => {
  switch (type) {
    case DesignerSitePreviewType.HOME:
      return <HomePreview />;
    default:
      return <Fragment />;
  }
};

export default DesignerSitePreview;
