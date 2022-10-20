import Image from "next/future/image";

export type PlatformPlacardType = {
  title: string;
  contract: string;
  subdomain: string;
  description: string;
  logo: string;
  cover_image: string;
};

const PlatformPlacard = ({
  platform,
  preview = true,
}: {
  platform: Partial<PlatformPlacardType>;
  preview?: boolean;
}) => {
  return (
    <div className="h-full w-full relative">
      <div className="flex items-center absolute text-white text-lg font-semibold m-6 z-20">
        {platform.logo && (
          <Image
            src={platform.logo}
            width={80}
            height={80}
            alt={"logo"}
            className="object-cover w-14 h-14 rounded-full mr-4"
          />
        )}
        <div>
          <div>{platform.title}</div>
          {platform.contract && (
            <div className="mt-1 text-sm font-light opacity-70">
              {`${platform.contract.slice(0, 6)}...${platform.contract.slice(
                platform.contract.length - 6,
                platform.contract.length
              )}`}
            </div>
          )}
          {!preview && platform.subdomain && (
            <div className="mt-1 text-sm font-light opacity-70">
              {`${platform.subdomain}.${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`}
            </div>
          )}
          {!preview && !platform.subdomain && platform.description && (
            <div className="mt-1 text-sm font-light opacity-70">
              {platform.description}
            </div>
          )}
        </div>
      </div>
      <div
        className={`bg-black opacity-40 absolute top-0 left-0 w-full h-full z-10 ${
          preview ? "rounded-md" : ""
        }`}
      ></div>
      {platform.cover_image ? (
        <Image
          src={platform.cover_image}
          alt="cover-image"
          className={`h-full w-full object-cover ${
            preview ? "rounded-md" : ""
          }`}
          width={200}
          height={200}
        />
      ) : (
        <div
          className={`bg-black w-full h-full ${preview ? "rounded-md" : ""}`}
        ></div>
      )}
    </div>
  );
};

export default PlatformPlacard;
