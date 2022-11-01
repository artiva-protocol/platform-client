import ArtivaConnectButton from "@/components/ArtivaConnectButton";
import Image from "next/future/image";
import React from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

const AuthModal = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <div className="h-[50vh] flex items-center justify-around">
      <div className="flex flex-col items-center">
        <Image alt="logo" src="/artiva-logo.svg" width="60" height="60" />
        <div className="text-4xl font-bold mt-10">Welcome to Artiva</div>
        <div className="text-gray-400">Connect your wallet to get started</div>

        {!address || chain?.id == process.env.NEXT_PUBLIC_PROTOCOL_NETWORK ? (
          <ArtivaConnectButton
            className={`bg-black text-white w-72 rounded-md h-8 text-sm focus:outline-none mt-8`}
          />
        ) : (
          <button
            onClick={() => {
              switchNetwork?.(
                parseInt(process.env.NEXT_PUBLIC_PROTOCOL_NETWORK!)
              );
            }}
            className="bg-black text-white w-72 rounded-md h-8 text-sm focus:outline-none mt-8"
          >
            Unsupported network
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
