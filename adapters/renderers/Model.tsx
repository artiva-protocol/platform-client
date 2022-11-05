//@ts-nocheck
import { Fragment } from "react";
import {
  RenderComponentType,
  RendererConfig,
  RenderingPreference,
  RenderRequest,
} from "@artiva/shared";
import Script from "next/script";
import { ArtivaClientConfig } from "configs/artiva-client-config";

interface ModelRenderer extends RendererConfig {
  renderingPage: string;
}

function getNormalizedURI(
  uri: string,
  { preferredIPFSGateway }: { preferredIPFSGateway?: string }
) {
  if (uri.startsWith("ipfs://")) {
    return uri.replace(
      "ipfs://",
      preferredIPFSGateway || "https://ipfs.io/ipfs/"
    );
  }
  if (uri.includes("/ipfs/") && preferredIPFSGateway) {
    return `${preferredIPFSGateway}${uri.replace(/^.+\/ipfs\//, "")}`;
  }
  if (uri.startsWith("ar://")) {
    return uri.replace("ar://", "https://arweave.net/");
  }

  return uri;
}

export const Model: ModelRenderer = {
  renderingPage:
    "https://gateway.pinata.cloud/ipfs/QmVc3UHHL6dhjWuY4cryY3yoEu1HoX8KcFafq3K4ELbZEJ/model-viewer.html",
  getRenderingPreference: (request: RenderRequest) => {
    if (request.media.content?.type?.startsWith("model/gltf")) {
      return request.renderingContext === "FULL"
        ? RenderingPreference.PREFERRED
        : RenderingPreference.NORMAL;
    }
    return RenderingPreference.INVALID;
  },
  render: (props: RenderComponentType) => {
    /* eslint-disable */
    const { preferredIPFSGateway } = ArtivaClientConfig;
    const mediaURI =
      props.request.media.content?.uri || props.request.media.animation?.uri;

    return (
      <Fragment>
        <Script
          type="module"
          src="https://www.unpkg.com/@google/model-viewer@1.12.0/dist/model-viewer.js"
        />
        <model-viewer
          auto-rotate="true"
          autoplay="true"
          camera-controls="true"
          class="ModelScene--viewer"
          src={getNormalizedURI(mediaURI, {
            preferredIPFSGateway,
          })}
          poster={getNormalizedURI(props.request.media.image?.uri, {
            preferredIPFSGateway,
          })}
          ar-status="not-presenting"
        ></model-viewer>
      </Fragment>
    );
  },
};
