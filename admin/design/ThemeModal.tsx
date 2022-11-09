import DesignerContext from "@/context/DesignerContext";
import { useState } from "react";
import Themes from "@/configs/themes-config";
import Image from "next/future/image";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ThemeModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { data, mutate } = DesignerContext.useContainer();
  const [customTheme, setCustomTheme] = useState<string>("");

  const updateTheme = (themeURL: string) => {
    mutate({ ...data!, themeURL });
  };

  const onAdd = () => {
    updateTheme(customTheme);
    setOpen(false);
  };

  return (
    <div className="mb-5 w-full flex items-center justify-around relative">
      <button
        onClick={() => {
          setOpen(false);
        }}
        className="absolute top-0 right-0"
      >
        <XMarkIcon className="h-5" />
      </button>
      <div className="w-full">
        <div className="text-2xl font-semibold">Themes</div>
        <div className="grid grid-cols-2 mt-6 gap-10">
          {Array.from(Themes).map(([id, theme]) => (
            <button
              onClick={() => {
                updateTheme(id);
                setOpen(false);
              }}
              className="text-left"
              key={id}
            >
              <Image
                src={`/${theme.previewImage}`}
                alt="preview"
                className="shadow-lg border"
                height={200}
                width={200}
              />
              <div className="font-semibold mt-4">{theme.title}</div>
              <div className="text-gray-500 text-sm font-light">
                {theme.category}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 font-semibold">Custom Theme</div>
        <div className="flex items-center mt-2 w-full">
          <input
            type="text"
            value={customTheme}
            onChange={(e) => {
              setCustomTheme(e.target.value);
            }}
            placeholder="https://arweave/..."
            className="bg-gray-100 w-full h-8 px-4 rounded-md focus:outline-none text-gray-900 text-sm"
          />
          <button onClick={onAdd} className="flex items-center h-full ml-2">
            <PlusCircleIcon className="h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
