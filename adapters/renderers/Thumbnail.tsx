import {
  RendererConfig,
  RenderingPreference,
  RenderRequest,
  RenderComponentType,
} from "@artiva/shared";
import { MediaLoader, useMediaObjectProps } from "./MediaLoader";
import { ArtivaClientConfig } from "configs/artiva-client-config";

export const Thumbnail: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    if (
      request.renderingContext === "THUMBNAIL" &&
      !!request.media.thumbnail?.uri
    ) {
      return RenderingPreference.PRIORITY;
    }

    return RenderingPreference.INVALID;
  },
  render: (requestProps: RenderComponentType, _) => {
    const { preferredIPFSGateway } = ArtivaClientConfig;
    const { request, className } = requestProps;

    /* eslint-disable */
    const { props, loading, error } = useMediaObjectProps({
      uri: request.media.thumbnail?.uri,
      preferredIPFSGateway,
      ...requestProps,
    });

    return (
      <MediaLoader loading={loading} error={error}>
        <img className={className} {...props} />
      </MediaLoader>
    );
  },
};
