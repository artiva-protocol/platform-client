import CustomConnectButton from "@/components/CustomConnectButton";
import useAuth from "hooks/auth/useAuth";
import useSignOut from "hooks/auth/useSignOut";
import usePublishingKey from "hooks/crypto/usePublishingKey";
import useSigningKey from "hooks/crypto/useSigningKey";
import useSignIn from "@/hooks/auth/useSignIn";
import Image from "next/future/image";
import React, { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useSWRConfig } from "swr";

const buttonActive =
  "bg-black text-white w-72 rounded-md h-8 text-sm focus:outline-none";
const buttonInactive =
  "border border-gray-400 text-gray-400 w-72 rounded-md h-8 text-sm focus:outline-none";

const AuthModal = () => {
  const { address } = useAccount();
  const { publicKey } = usePublishingKey();
  const { signature, generateSignature } = useSigningKey();
  const [signIn, setSignIn] = useState(false);
  const [connect, setConnect] = useState<React.ReactNode | undefined>();
  const { data, error: authError } = useAuth();
  const { mutate } = useSWRConfig();
  const { chain } = useNetwork();

  const { send, loading, success, error } = useSignIn({
    data: { signature, publicKey, address },
    onSettled: () => {
      mutate(`${process.env.NEXT_PUBLIC_SERVER_BASEURL}/auth/me`);
      setSignIn(false);
    },
  });

  const { signOut } = useSignOut();

  const onSignIn = () => {
    if (!signature) generateSignature();
    setSignIn(true);
  };

  useEffect(() => {
    setConnect(
      <CustomConnectButton
        className={`${
          address && !chain?.unsupported ? buttonInactive : buttonActive
        } mt-8`}
      />
    );
  }, [address, chain?.unsupported]);

  useEffect(() => {
    if (!signIn || loading || success || error || !signature) return;
    send();
  }, [signIn, loading, success, error, send, signature]);

  return (
    <div className="h-[50vh] flex items-center justify-around">
      <div className="flex flex-col items-center">
        <Image alt="logo" src="/artiva-logo.svg" width="60" height="60" />
        <div className="text-4xl font-bold mt-10">Welcome to Artiva</div>
        <div className="text-gray-400">Sign in to get started</div>

        {connect}

        {signature && (authError || (data?.user && !data?.user?.roles)) ? (
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
