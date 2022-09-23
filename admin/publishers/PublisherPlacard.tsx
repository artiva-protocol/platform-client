import { RectangleStackIcon } from "@heroicons/react/24/solid";
//import { Publisher } from "@artiva/shared";

const PublisherPlacard = ({ publisher }: { publisher: any }) => {
  const getIcon = (address: string) => {
    const iconStyle = "w-12 shadow-md bg-blue-300 p-2 text-white rounded-full";

    switch (address) {
      case "0x04bfb0034F24E424489F566f32D1f57647469f9E":
        return <RectangleStackIcon className={iconStyle} />;
    }
  };

  return (
    <div className="bg-blue-400 text-white shadow-md rounded-md h-72 text-center px-10 w-1/3 flex items-center">
      <div className="w-full">
        <div className="w-full flex items-center justify-around">
          {getIcon(publisher.address)}
        </div>
        <div className="text-2xl font-semibold mt-4">{publisher.name}</div>
        <div className="w-full flex items-center justify-around">
          <div className="text-sm mt-2 text-white border border-blue-200 w-48 rounded-full">{`${publisher.address.slice(
            0,
            6
          )}...${publisher.address.slice(
            publisher.address.length - 6,
            publisher.address.length
          )}`}</div>
        </div>
        <button className="mt-6 bg-white text-gray-600 w-full h-8 rounded-md">
          Install
        </button>
        <button className="mt-2 border border-white text-white w-full h-8 rounded-md">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default PublisherPlacard;
