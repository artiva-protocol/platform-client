import useUser from "@/hooks/auth/useUser";
import React from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
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
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  if (address && chain?.id == process.env.NEXT_PUBLIC_PROTOCOL_NETWORK)
    return children;

  return !address ? (
    <ArtivaConnectButton className={className} />
  ) : (
    <button
      onClick={() => {
        switchNetwork?.(parseInt(process.env.NEXT_PUBLIC_PROTOCOL_NETWORK!));
      }}
      className={className}
    >
      Unsupported network
    </button>
  );
};

export default AuthWrapper;
