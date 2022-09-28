import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/future/image";
import { Fragment } from "react";

export type ProtocolSaveToastProps = {
  loading: boolean;
  error: Error | undefined | null;
  success: boolean;
};

const ProtocolSaveToast = ({
  error,
  success,
  loading,
}: ProtocolSaveToastProps) => {
  const baseStyle =
    " w-72 text-center h-48 flex items-center justify-around rounded-md shadow-xl bg-black text";

  const Content = () => {
    if (success) {
      return (
        <div className={`${baseStyle}`}>
          <div className="w-full flex flex-col items-center">
            <CheckCircleIcon className="w-14 h-14 text-white" />
            <div className="text-gray-300 mt-8 font-extralight">
              Saved successfully
            </div>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className={`${baseStyle}`}>
          <div className="w-full flex flex-col items-center">
            <Image
              src={"/images/grid-loader.svg"}
              alt="loader"
              width={40}
              height={40}
            />
            <div className="text-gray-300 mt-8 font-extralight">
              Publishing to Artiva
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${baseStyle}`}>
          <div className="w-full flex flex-col items-center">
            <ExclamationCircleIcon className="w-14 h-14 text-white" />
            <div className="text-gray-300 mt-8 font-extralight">
              {`Error: ${error.message}`}
            </div>
          </div>
        </div>
      );
    }

    return <Fragment />;
  };

  return (
    <Transition
      show={success || !!error || loading}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Content />
    </Transition>
  );
};

export default ProtocolSaveToast;
