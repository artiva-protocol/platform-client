import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction } from "react";

const CurateNavElement = ({
  navId,
  title,
  icon,
  selected,
  setSelected,
}: {
  navId: string;
  title: string;
  icon: JSX.Element;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <button
      onClick={() => {
        setSelected((x: string) => (x === navId ? "" : navId));
      }}
      className={`mt-2 px-8 py-2 flex items-center justify-between w-full ${
        selected !== navId && "hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center">
        {icon}
        <div className="ml-2 font-light text-gray-600">{title}</div>
      </div>
      {selected === navId ? (
        <ChevronUpIcon className="w-4 text-gray-600" />
      ) : (
        <ChevronDownIcon className="w-4 text-gray-600" />
      )}
    </button>
  );
};

export default CurateNavElement;
