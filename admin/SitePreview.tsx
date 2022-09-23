import { Fragment, RefObject, useEffect } from "react";
import { useState } from "react";

export const SitePreview = ({
  passedRef,
}: {
  passedRef?: RefObject<HTMLIFrameElement>;
}) => {
  const [baseurl, setBaseurl] = useState<string | undefined>();
  useEffect(() => {
    setBaseurl(
      typeof window !== "undefined" ? `${window.location.origin}` : undefined
    );
  }, []);

  if (!baseurl) return <Fragment />;

  return (
    <iframe
      ref={passedRef}
      style={{ width: "100%", height: "100%" }}
      src={baseurl}
    />
  );
};
