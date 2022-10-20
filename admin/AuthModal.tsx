import ArtivaConnectButton from "@/components/ArtivaConnectButton";
import Image from "next/future/image";
import React from "react";

const AuthModal = () => {
  return (
    <div className="h-[50vh] flex items-center justify-around">
      <div className="flex flex-col items-center">
        <Image alt="logo" src="/artiva-logo.svg" width="60" height="60" />
        <div className="text-4xl font-bold mt-10">Welcome to Artiva</div>
        <div className="text-gray-400">Connect your wallet to get started</div>

        <ArtivaConnectButton
          className={`bg-black text-white w-72 rounded-md h-8 text-sm focus:outline-none mt-8`}
        />
      </div>
    </div>
  );
};

export default AuthModal;
