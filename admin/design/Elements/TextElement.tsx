import { Fragment } from "react";

export type TextElementProps = {
  title: string;
  description?: string;
  value?: string;
  onChange: (value: string | null) => void;
};

const TextElement = ({
  title,
  description,
  value,
  onChange,
}: TextElementProps) => {
  return (
    <Fragment>
      <div className="text-sm">{title}</div>
      <div className="text-gray-500 text-sm mt-1">{description}</div>
      <input
        type="text"
        placeholder="Description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-1 px-2 mt-2 rounded-md focus:outline-none"
      />
    </Fragment>
  );
};

export default TextElement;
