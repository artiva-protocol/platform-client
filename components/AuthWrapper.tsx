import useUser from "@/hooks/auth/useUser";
import React from "react";
import ArtivaConnectButton from "./ArtivaConnectButton";

const AuthWrapper = ({
  children,
  className,
}: {
  children: React.ReactElement;
  className: string;
}) => {
  const {
    user: { address },
  } = useUser();
  if (!address) return <ArtivaConnectButton className={className} />;
  return children;
};

export default AuthWrapper;
