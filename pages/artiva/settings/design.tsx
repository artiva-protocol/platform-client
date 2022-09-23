import AdminLayout from "@/admin/AdminLayout";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getWalletClient, WalletAppContext } from "configs/wallet-config";
import { ReactChild } from "react";
import DesignHeader from "@/admin/design/DesignHeader";
import DesignerContext from "@/context/DesignerContext";
import DesignerPreviewWrapper from "@/admin/DesignerPreviewWrapper";
import DesignerPreviewComponent, {
  DesignerSitePreviewType,
} from "@/admin/design/Previews";

const Design = () => {
  return (
    <DesignerContext.Provider>
      <RainbowKitWrapper>
        <AdminLayout>
          <div className="p-6 px-10 h-full">
            <DesignHeader />
            <DesignerPreviewWrapper>
              <DesignerPreviewComponent type={DesignerSitePreviewType.HOME} />
            </DesignerPreviewWrapper>
          </div>
        </AdminLayout>
      </RainbowKitWrapper>
    </DesignerContext.Provider>
  );
};

const RainbowKitWrapper = ({ children }: { children: ReactChild }) => {
  const { chains } = getWalletClient(WalletAppContext.ADMIN);
  const { data } = DesignerContext.useContainer();
  return (
    <RainbowKitProvider
      chains={chains}
      theme={lightTheme({
        accentColor: data?.accent_color,
        borderRadius: "medium",
        fontStack: "system",
        overlayBlur: "small",
      })}
    >
      {children}
    </RainbowKitProvider>
  );
};

export default Design;
