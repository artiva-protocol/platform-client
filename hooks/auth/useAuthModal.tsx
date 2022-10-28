import AuthModal from "@/admin/AuthModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import useUser from "./useUser";

const useAuthModal = () => {
  const {
    user: { address },
    status,
  } = useUser();
  const { chain } = useNetwork();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(
      (status !== "loading" && !address) ||
        chain?.id != process.env.NEXT_PUBLIC_PROTOCOL_NETWORK
    );
  }, [status, address, chain]);

  return (
    <ModalWrapper setOpen={() => {}} open={open}>
      <AuthModal />
    </ModalWrapper>
  );
};

export default useAuthModal;
