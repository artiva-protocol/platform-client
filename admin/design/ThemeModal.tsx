import DesignerContext from "@/context/DesignerContext";
import { useState } from "react";

const ThemeModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { data, mutate } = DesignerContext.useContainer();
  const [themeURL, setThemeURL] = useState<string | undefined>(data?.themeURL);

  const onAdd = () => {
    mutate({ ...data!, themeURL: themeURL });
    setOpen(false);
  };

  return (
    <div>
      <div className="text-2xl font-semibold">Add a theme</div>

      <input
        type="text"
        value={themeURL}
        onChange={(e) => {
          setThemeURL(e.target.value);
        }}
        placeholder="https://arweave/..."
        className="bg-gray-100 w-full mt-2 p-1 px-4 rounded-md focus:outline-none text-gray-900 text-sm"
      />
      <div className="w-full flex items-center justify-end mt-6">
        <button
          onClick={() => setOpen(false)}
          className="text-sm bg-gray-200 rounded-md h-8 w-20 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={onAdd}
          className="text-sm text-white bg-black rounded-md h-8 w-20"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ThemeModal;
