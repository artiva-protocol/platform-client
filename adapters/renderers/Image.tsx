import { forwardRef, Fragment, useMemo } from "react";
import { MediaLoader, useMediaObjectProps } from "./MediaLoader";
import {
  RenderComponentType,
  RendererConfig,
  RenderingPreference,
  RenderRequest,
} from "@artiva/shared";
import Image from "next/future/image";
import { ArtivaClientConfig } from "configs/artiva-client-config";

const sources = ["arweave.net", process.env.NEXT_PUBLIC_IPFS_GATEWAY];

export const ImageRenderer = forwardRef<HTMLImageElement, RenderComponentType>(
  (requestProps, ref) => {
    const { request, className } = requestProps;
    const { preferredIPFSGateway } = ArtivaClientConfig;
    const { props, loading, error } = useMediaObjectProps({
      uri: request.media.image?.uri || request.media.content?.uri,
      preferredIPFSGateway,
      ...requestProps,
    });

    const cache = useMemo(() => {
      return !!sources.find((x) => props.src?.includes(x || ""));
    }, [sources, props.src]);

    if (!props.src) return <Fragment />;

    if (!cache)
      return (
        <MediaLoader loading={loading} error={error}>
          <img ref={ref} className={className} {...props} />
        </MediaLoader>
      );

    return (
      <MediaLoader loading={loading} error={error}>
        <Image
          alt="NFTImage"
          priority={true}
          height={request.renderingContext === "PREVIEW" ? 250 : 1600}
          width={request.renderingContext === "PREVIEW" ? 500 : 1600}
          src={props.src}
          className={className}
          onLoadingComplete={props.onLoad}
          onError={props.onError}
          itemRef={""}
        />
      </MediaLoader>
    );
  }
);

ImageRenderer.displayName = "ImageRenderer";

export const ImageComponent: RendererConfig = {
  getRenderingPreference: (request: RenderRequest) => {
    const type = request.media.content?.type;
    const video =
      type?.includes("video") ||
      !!request.media?.animation ||
      request.media.image?.uri.endsWith("mp4");

    const image = type?.includes("image") || !!request.media?.image;
    if (!video && image) return RenderingPreference.PREFERRED;

    return RenderingPreference.INVALID;
  },
  render: ImageRenderer,
};
