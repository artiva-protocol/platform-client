import { Fragment } from "react";

const SelectElement = ({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
}) => {
  return (
    <Fragment>
      <div className="text-sm">{title}</div>
      <select
        className="w-full p-2 mt-2 rounded-md focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
    </Fragment>
  );
};

export default SelectElement;
