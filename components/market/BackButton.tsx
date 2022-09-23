import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };

  return (
    <button
      onClick={onClick}
      className="absolute bg-black text-white top-5 left-5 rounded-full p-2"
    >
      <ArrowLeftIcon className="w-5" />
    </button>
  );
};

export default BackButton;
