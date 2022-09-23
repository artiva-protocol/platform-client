import {
  RendererConfig,
  RenderingPreference,
  RenderRequest,
  RenderComponentType,
} from "@artiva/shared";
import { ImageComponent } from "./Image";
import { Video } from "./Video";

export const VideoPreviews: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    const type = request.media.content?.type || request.media.animation?.type;

    const video = type?.includes("video");
    const image = request.media?.image;

    if (
      video &&
      image &&
      !image.uri.endsWith(".mp4") &&
      request.networkId === "1"
    )
      return RenderingPreference.PRIORITY;

    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    if (props.request.renderingContext !== "FULL") {
      const tmp = { ...props };
      tmp.request.media.animation = undefined;
      tmp.request.media.content = undefined;
      return <ImageComponent.render {...props} />;
    } else {
      return <Video.render {...props} />;
    }
  },
};
