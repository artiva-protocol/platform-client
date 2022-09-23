import ProtocolSaveToast from "@/components/ProtocolSaveToast";
import DesignerContext from "@/context/DesignerContext";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/solid";

const DesignHeader = () => {
  const { save } = DesignerContext.useContainer();

  const onSave = async () => {
    await save.save();
  };

  return (
    <div className="flex justify-between items-baseline relative">
      <h1 className="text-3xl font-bold">Site Design</h1>

      <div className="flex">
        <button
          onClick={onSave}
          className="bg-black text-white w-24 h-8 rounded-md text-sm"
        >
          Save
        </button>
      </div>

      <div className="absolute top-14 right-0">
        <ProtocolSaveToast {...save} />
      </div>
    </div>
  );
};

export default DesignHeader;
