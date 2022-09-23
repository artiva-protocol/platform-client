import AuthModal from "@/admin/AuthModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

const useAuthModal = (redirect: string = "/artiva/auth") => {
  const { data, error } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!data && !error) return;
      if (error || !data?.user) throw new Error("Error validating user");
      const {
        roles: { admin, contentPublisher, metadataManager },
      } = data.user;

      if (!admin && !contentPublisher && !metadataManager)
        throw new Error("User not authorized");

      setOpen(false);
    } catch (err) {
      setOpen(true);
    }
  }, [data, error, redirect]);

  const content = (
    <ModalWrapper setOpen={() => {}} open={open} className="w-full max-w-lg">
      <AuthModal />
    </ModalWrapper>
  );

  return { content };
};

export default useAuthModal;
