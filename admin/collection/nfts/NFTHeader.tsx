import ProtocolSaveToast from "@/components/ProtocolSaveToast";
import CuratorContext from "@/context/CuratorContext";

const NFTHeader = ({ title }: { title: string }) => {
  const { collection, add } = CuratorContext.useContainer();
  return (
    <div className="pb-4 flex justify-between items-baseline relative">
      <div className="flex">
        <h1 className="text-3xl font-bold mr-6">{title}</h1>
      </div>
      <div className="flex">
        <div className="font-light mr-4 text-gray-500 border-gray-400 border rounded-md w-28 h-8 flex items-center justify-around">{`${collection.length} Curated`}</div>
        <button
          onClick={add.save}
          className="bg-black text-white h-8 w-24 rounded-md"
        >
          Save
        </button>
      </div>
      <div className="absolute top-14 right-0 z-10">
        <ProtocolSaveToast {...add} />
      </div>
    </div>
  );
};

export default NFTHeader;
