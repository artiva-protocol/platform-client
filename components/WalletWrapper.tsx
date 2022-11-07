import React from "react";
import { useAccount, useNetwork } from "wagmi";
import ArtivaConnectButton from "./ArtivaConnectButton";

const WalletWrapper = ({
  children,
  className,
}: {
  children: React.ReactElement;
  className: string;
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  if (address && chain?.unsupported === false) return children;
  return <ArtivaConnectButton className={className} />;
};

export default WalletWrapper;
