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
    const content =
      type?.includes("video") ||
      type?.includes("model/gltf") ||
      !!request.media?.animation;
    const image = type?.includes("image") || !!request.media?.image;

    if (!content && image) return RenderingPreference.PREFERRED;

    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    return <ImageComponent.render {...props} />;
  },
};
