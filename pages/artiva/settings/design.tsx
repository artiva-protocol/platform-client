import AdminLayout from "@/admin/AdminLayout";
import DesignHeader from "@/admin/design/DesignHeader";
import DesignerContext from "@/context/DesignerContext";
import DesignerPreviewWrapper from "@/admin/DesignerPreviewWrapper";
import DesignerPreviewComponent, {
  DesignerSitePreviewType,
} from "@/admin/design/Previews";

const Design = () => {
  return (
    <DesignerContext.Provider>
      <AdminLayout>
        <div className="p-6 px-10 h-full">
          <DesignHeader />
          <DesignerPreviewWrapper>
            <DesignerPreviewComponent type={DesignerSitePreviewType.HOME} />
          </DesignerPreviewWrapper>
        </div>
      </AdminLayout>
    </DesignerContext.Provider>
  );
};

export default Design;
