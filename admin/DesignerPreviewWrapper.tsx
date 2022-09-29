import DesignerContext from "@/context/DesignerContext";
import {
  ReactNode,
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
  Fragment,
} from "react";
import { createPortal } from "react-dom";

export const DesignerPreviewWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: designerData, loading } = DesignerContext.useContainer();
  const [mountNode, setMountNode] = useState<HTMLElement | undefined>();
  const iframeMutableRef = useRef<HTMLIFrameElement>();

  const callbackRef = useCallback((iframeRef: HTMLIFrameElement) => {
    if (!iframeRef) return;
    iframeMutableRef.current = iframeRef;
  }, []);

  const onLoad = useCallback(() => {
    const iframeRef = iframeMutableRef.current!;

    //Inject built styles into the iframe
    const head = iframeRef.contentWindow?.document?.head!;
    if (head.firstChild) head.removeChild(head.firstChild);

    const link = document.createElement("link");
    link.href = `${
      designerData?.themeURL || process.env.NEXT_PUBLIC_BASE_THEME_URL
    }/index.css`;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.id = "theme-styles";

    head.appendChild(link);

    //Set iframe node to be used with portal
    setMountNode(iframeRef.contentWindow?.document?.body);
  }, [designerData?.themeURL]);

  useEffect(() => {
    setMountNode(undefined);
  }, [designerData?.themeURL]);

  useEffect(() => {
    if (mountNode || loading) return;
    iframeMutableRef.current!.contentWindow?.location.reload();
    iframeMutableRef.current!.addEventListener("load", onLoad);
  }, [mountNode, onLoad, loading]);

  const portal = useMemo(() => {
    if (!mountNode) return <Fragment />;
    return createPortal(children, mountNode);
  }, [children, mountNode]);

  return (
    <div
      className="border border-gray-100 mt-10 shadow-xl overflow-y-auto"
      style={{ height: "80vh" }}
    >
      <iframe
        id="preview-frame"
        ref={callbackRef}
        style={{ width: "100%", height: "100%" }}
      >
        {portal}
      </iframe>
    </div>
  );
};

export default DesignerPreviewWrapper;
