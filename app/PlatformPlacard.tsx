import { GetPlatformsResponse } from "@/services/platform-graph";
import Image from "next/future/image";

const PlatformPlacard = ({
  platform,
  rounding = true,
}: {
  platform: GetPlatformsResponse;
  rounding?: boolean;
}) => {
  return (
    <div className="h-full w-full relative">
      <div className="absolute text-white text-lg font-semibold m-6 z-20">
        <div>{platform.title}</div>
        <div className="mt-1 text-sm font-light opacity-70">
          {`${platform.contract.slice(0, 6)}...${platform.contract.slice(
            platform.contract.length - 6,
            platform.contract.length
          )}`}
        </div>
      </div>
      <div
        className={`bg-black opacity-40 absolute top-0 left-0 w-full h-full z-10 ${
          rounding ? "rounded-md" : ""
        }`}
      ></div>
      {platform.cover_image ? (
        <Image
          src={platform.cover_image}
          alt="cover-image"
          className={`h-full w-full object-cover ${
            rounding ? "rounded-md" : ""
          }`}
          width={200}
          height={200}
        />
      ) : (
        <div
          className={`bg-black w-full h-full ${rounding ? "rounded-md" : ""}`}
        ></div>
      )}
    </div>
  );
};

export default PlatformPlacard;
