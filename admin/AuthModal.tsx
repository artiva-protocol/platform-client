import useAuth from "@/hooks/auth/useAuth";
import useSignIn from "@/hooks/auth/useSignIn";
import { CustomConnectButton } from "@artiva/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useSignOut from "hooks/auth/useSignOut";
import Image from "next/future/image";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { useAccount, useNetwork } from "wagmi";

const buttonActive =
  "bg-black text-white w-72 rounded-md h-8 text-sm focus:outline-none";
const buttonInactive =
  "border border-gray-400 text-gray-400 w-72 rounded-md h-8 text-sm focus:outline-none";

const AuthModal = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { signOut } = useSignOut();
  const [signIn, setSignIn] = useState(false);

  const { mutate } = useSWRConfig();
  const { send } = useSignIn({
    data: {
      address,
    },
    onSettled: () => {
      mutate(`${process.env.NEXT_PUBLIC_SERVER_BASEURL}/auth/me`);
      setSignIn(false);
    },
  });
  const { error, data } = useAuth();
  const onSignIn = () => {
    setSignIn(true);
    send();
  };

  return (
    <div className="h-[50vh] flex items-center justify-around">
      <div className="flex flex-col items-center">
        <Image alt="logo" src="/artiva-logo.svg" width="60" height="60" />
        <div className="text-4xl font-bold mt-10">Welcome to Artiva</div>
        <div className="text-gray-400">Connect your wallet to get started</div>

        <ConnectButton.Custom>
          {(props) => (
            <CustomConnectButton
              {...props}
              className={`${
                address && !chain?.unsupported ? buttonInactive : buttonActive
              } mt-8`}
            />
          )}
        </ConnectButton.Custom>

        {error || (data?.user && !data?.user?.roles) ? (
          <div
            className={
              buttonActive + " flex items-center justify-around mt-2 text-xs"
            }
          >
            Wallet is not authorized
          </div>
        ) : address && !chain?.unsupported ? (
          <button
            onClick={onSignIn}
            disabled={!address || chain?.unsupported}
            className={buttonActive + " mt-2"}
          >
            {signIn ? "Signing In..." : "Sign In"}
          </button>
        ) : (
          <div
            className={
              buttonInactive + " flex items-center justify-around mt-2"
            }
          >
            Sign In
          </div>
        )}

        {address && (
          <button
            onClick={signOut}
            className="text-xs font-light text-gray-600 mt-2"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
