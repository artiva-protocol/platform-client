import {
  RendererConfig,
  RenderingPreference,
  RenderRequest,
  RenderComponentType,
} from "@artiva/shared";
import { Video } from "./Video";
import { ethers } from "ethers";

export const VideoCustom: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    const type = request.media.content?.type || request.media.animation?.type;

    const video = type?.includes("video");
    if (video) return RenderingPreference.PREFERRED;
    if (!type && !!request.media.animation?.uri)
      return RenderingPreference.NORMAL;

    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    const type =
      props.request.media.content?.type || props.request.media.animation?.type;
    if (type == "video/quicktime" && props.request.networkId === "1") {
      if (props.request.media.content)
        props.request.media.content.uri = `https://d2iccaf7eutw5f.cloudfront.net/${ethers.utils.getAddress(
          props.request.contract || ""
        )}/${props.request.tokenId}/large`;
      if (props.request.media.animation)
        props.request.media.animation.uri = `https://d2iccaf7eutw5f.cloudfront.net/${ethers.utils.getAddress(
          props.request.contract || ""
        )}/${props.request.tokenId}/large`;
    }
    return <Video.render {...props} />;
  },
};
