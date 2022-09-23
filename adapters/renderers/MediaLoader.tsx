import React, { useState } from "react";
import type { RenderRequest } from "@artiva/shared";

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

export function useMediaObjectProps({
  uri,
  request,
  preferredIPFSGateway,
  onComponentLoaded,
}: {
  uri: string | undefined;
  request: RenderRequest;
  preferredIPFSGateway?: string;
  onComponentLoaded?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  return {
    loading,
    error,
    props: {
      alt: request.metadata?.name || request.metadata?.description,
      onLoad: () => {
        setLoading(false);
        if (onComponentLoaded) onComponentLoaded();
      },
      onError: () => setError("Error loading"),
      src: uri ? getNormalizedURI(uri, { preferredIPFSGateway }) : uri,
    },
  };
}

export const MediaLoader = ({
  children,
  loading,
  error,
}: {
  children: React.ReactNode;
  loading: boolean;
  error: string | undefined;
}) => {
  if (!loading && !error) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  if (error) {
    return (
      <React.Fragment>
        <span className="mediaObjectMessage"></span>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <span className="mediaLoader"></span>
      {children}
    </React.Fragment>
  );
};
