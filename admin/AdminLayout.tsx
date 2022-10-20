import { useRouter } from "next/router";
import React from "react";
import AdminNavigation from "./AdminNavigation";
import NFTContractNavigation from "./collection/nftContracts/NFTContractNavigation";
import NFTNavigation from "./collection/nfts/NFTNavigation";
import DesignNavigation from "./design/DesignNavigation";

const AdminLayout = ({ children }: { children: React.ReactChild }) => {
  const router = useRouter();

  return (
    <div className="flex">
      {router.pathname.includes("design") ? (
        <DesignNavigation />
      ) : router.pathname.includes("nfts") ? (
        <NFTNavigation />
      ) : router.pathname.includes("contracts") ? (
        <NFTContractNavigation />
      ) : (
        <AdminNavigation />
      )}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default AdminLayout;
