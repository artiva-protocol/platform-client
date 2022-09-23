import {
  RendererConfig,
  RenderingPreference,
  RenderRequest,
  RenderComponentType,
} from "@artiva/shared";
import { ImageComponent } from "./Image";

export const ImageCustom: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    const type = request.media.content?.type;
    const video = type?.includes("video") || !!request.media?.animation;
    const image = type?.includes("image") || !!request.media?.image;
    if (!video && image) return RenderingPreference.PREFERRED;

    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    return <ImageComponent.render {...props} />;
  },
};
