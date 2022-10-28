import ProtocolSaveToast from "@/components/ProtocolSaveToast";
import MetadataContext from "@/context/MetadataContext";
import { Fragment } from "react";

const MetadataSaveButton = () => {
  const { save, changeCount } = MetadataContext.useContainer();

  return (
    <div className="relative h-10">
      <div className="flex items-center">
        {(changeCount > 0 || save.success) && (
          <Fragment>
            <div className="p-3 mr-3 border-r text-md text-gray-400">{`${changeCount} unsaved changes`}</div>
            <button
              className="text-md text-white rounded-md w-32 h-8 bg-black"
              onClick={() => {
                save.save();
              }}
            >
              Save onchain
            </button>
          </Fragment>
        )}
      </div>
      <div className="absolute top-14 right-0 z-30">
        <ProtocolSaveToast {...save} />
      </div>
    </div>
  );
};

export default MetadataSaveButton;
