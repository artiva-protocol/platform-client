import {
  RendererConfig,
  RenderingPreference,
  RenderRequest,
  RenderComponentType,
} from "@artiva/shared";
import { ImageComponent } from "./Image";
import { Video } from "./Video";

export const EditionAnimations: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    const isAudio =
      request.media.content?.type?.startsWith("audio") ||
      request.media.animation?.type?.startsWith("audio");

    const uri = request.media?.animation?.uri;
    if (!isAudio && uri && uri.includes("ipfs")) {
      return RenderingPreference.NORMAL;
    }
    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    const animation = props.request.media?.animation?.uri;
    const img = props.request.media?.image?.uri;
    const type = props.request.media?.content?.type;
    if (
      (animation &&
        !animation.includes("artblocks") &&
        !animation.endsWith(".gif")) ||
      img?.endsWith(".mp4") ||
      (type && type?.includes("video"))
    ) {
      if (img?.endsWith(".mp4")) props.request.media.content = { uri: img };
      return <Video.render {...props} />;
    } else {
      return <ImageComponent.render {...props} />;
    }
  },
};
