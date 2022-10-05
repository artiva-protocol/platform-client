import AuthModal from "@/admin/AuthModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import useAuth from "./useAuth";
import useSignOut from "./useSignOut";

const useAuthModal = (redirect: string = "/artiva/auth") => {
  const { address } = useAccount({
    onDisconnect: () => {
      signOut();
    },
  });
  const { chain } = useNetwork();
  const { data, error } = useAuth();
  const [open, setOpen] = useState(false);

  const { signOut } = useSignOut();

  useEffect(() => {
    try {
      console.log("Auth data", {
        address,
        chain: chain?.unsupported,
      });

      if (!address || chain?.unsupported) throw new Error("Wallet error");
      if (error || !data?.user) throw new Error("Error validating user");

      const {
        roles: { admin, contentPublisher, metadataManager },
      } = data.user;

      if (!admin && !contentPublisher && !metadataManager)
        throw new Error("User not authorized");

      console.log("Sign in success");
      setOpen(false);
    } catch (err) {
      console.log("Error signing in", err);
      setOpen(true);
    }
  }, [data, error, address, chain]);

  const content = (
    <ModalWrapper setOpen={() => {}} open={open} className="w-full max-w-lg">
      <AuthModal />
    </ModalWrapper>
  );

  return { content };
};

export default useAuthModal;
