import DesignerContext from "@/context/DesignerContext";
import useThemeURL from "@/hooks/theme/useThemeURL";
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
  const { data: designerData } = DesignerContext.useContainer();
  const themeURL = useThemeURL({
    theme: designerData?.themeURL,
    remoteEntry: false,
  });
  const [mountNode, setMountNode] = useState<HTMLElement | undefined>();
  const iframeMutableRef = useRef<HTMLIFrameElement>();

  const callbackRef = useCallback((iframeRef: HTMLIFrameElement) => {
    if (!iframeRef) return;
    iframeMutableRef.current = iframeRef;
  }, []);

  useEffect(() => {
    const iframeRef = iframeMutableRef.current;
    if (!iframeRef) return;

    //Clear the theme cache before reloading designer
    //@ts-ignore
    window.theme = undefined;

    iframeRef.contentWindow?.location.reload();

    iframeRef.addEventListener("load", () => {
      //Inject built styles into the iframe
      const head = iframeRef.contentWindow?.document?.head!;
      const link = document.createElement("link");

      link.href = `${themeURL}/index.css`;
      link.rel = "stylesheet";
      link.type = "text/css";

      head.appendChild(link);

      //Set iframe node to be used with portal
      setMountNode(iframeRef.contentWindow?.document?.body);
    });
  }, [themeURL]);

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
