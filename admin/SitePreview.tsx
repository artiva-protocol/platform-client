import { Fragment, RefObject, useEffect } from "react";
import { useState } from "react";

export const SitePreview = ({
  passedRef,
  url,
}: {
  passedRef?: RefObject<HTMLIFrameElement>;
  url?: string;
}) => {
  const [baseurl, setBaseurl] = useState<string | undefined>();
  useEffect(() => {
    setBaseurl(
      url
        ? url
        : typeof window !== "undefined"
        ? `${window.location.origin}`
        : undefined
    );
  }, [url]);

  if (!baseurl) return <Fragment />;

  return (
    <iframe
      ref={passedRef}
      style={{ width: "100%", height: "100%" }}
      src={baseurl}
    />
  );
};
