import { Switch } from "@headlessui/react";

const SwitchElement = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">{title}</div>
      <Switch
        checked={value}
        onChange={onChange}
        className={`${
          value ? "bg-black" : "bg-gray-400"
        } relative inline-flex h-5 w-10 items-center rounded-full`}
      >
        <span
          className={`${
            value ? "translate-x-5" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
};

export default SwitchElement;
