import AdminLayout from "@/admin/AdminLayout";
import { SitePreview } from "@/admin/SitePreview";

const Site = () => {
  return (
    <AdminLayout>
      <div className="w-full" style={{ height: "100vh" }}>
        <SitePreview />
      </div>
    </AdminLayout>
  );
};

export default Site;
