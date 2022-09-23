import { Popover } from "@headlessui/react";
import { Fragment } from "react";
import { ChromePicker } from "react-color";

const ColorElement = ({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description?: string;
  value: string | undefined;
  onChange: (value: string) => void;
}) => {
  return (
    <Fragment>
      <div className="pr-2">
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="text-gray-500 text-sm mt-1">{description}</div>
        )}
      </div>
      <Popover className="h-6 flex">
        <Popover.Button
          style={{ backgroundColor: value || "#000" }}
          className="w-6 h-full border-r"
        ></Popover.Button>
        <input
          className="pl-1 w-16 text-xs font-light focus:outline-none"
          value={value || "#000"}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <Popover.Panel className="absolute top-7 right-0">
          <ChromePicker
            color={value || "#000"}
            onChange={(e) => {
              onChange(e.hex);
            }}
          />
        </Popover.Panel>
      </Popover>
    </Fragment>
  );
};

export default ColorElement;
