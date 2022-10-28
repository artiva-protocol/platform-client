import { Platform } from "@artiva/shared";
import { ArrowLeftCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import PlatformPlacard from "app/PlatformPlacard";
import Image from "next/future/image";
import { Fragment, useMemo, useState } from "react";
import styles from "@/styles/Upload.module.css";
import Link from "next/link";
import useIPFSUpload from "@/hooks/ipfs/useIPFSUpload";
import useCreatePlatform, {
  RoleEnum,
} from "@/hooks/platform/useCreatePlatform";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { getPlatformsByUserAfterTimeStamp } from "@/services/platform-graph";
import ModalWrapper from "@/components/ModalWrapper";
import AuthWrapper from "@/components/AuthWrapper";

type CreatePlatformDataType = Pick<
  Platform,
  "title" | "description" | "logo" | "cover_image"
>;

const CreatePlatform = () => {
  const { address } = useAccount();
  const [data, setData] = useState<Partial<CreatePlatformDataType>>({});
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | undefined>();

  const startAt = useMemo(() => {
    return Math.round(Date.now() / 1000);
  }, []);

  const { data: platformAddress, mutate } = useSWR(
    address ? `platforms:${address}:${startAt}` : undefined,
    () => {
      return getPlatformsByUserAfterTimeStamp(address!, startAt.toString());
    },
    { refreshInterval: 1000 }
  );

  const { save, loading } = useCreatePlatform({
    data: {
      ...data,
      title: data.title!,
      description: data.description!,
      custom: {},
    },
    roles: address ? [{ account: address, role: RoleEnum.ADMIN }] : [],
    onSettled: () => {
      mutate();
    },
  });

  return (
    <div className="h-[100vh] w-full flex relative">
      {platformAddress && <SuccessModal platformAddress={platformAddress} />}
      <Link href={"/"}>
        <a className="absolute top-2 left-2">
          <ArrowLeftCircleIcon className="h-8" />
        </a>
      </Link>
      <div className="w-1/2 h-full flex items-center justify-around bg-gray-100">
        <div className="text-left w-[35vw]">
          <div className="text-3xl font-semibold">Create Your Platform</div>

          <div className="mt-8 text-sm">Title</div>
          <input
            value={data.title}
            onChange={(e) => setData((x) => ({ ...x, title: e.target.value }))}
            className="w-full rounded-md px-3 h-8 mt-1 focus:outline-none"
            placeholder="My Platform"
          />

          <div className="mt-6  text-sm">Description</div>
          <textarea
            value={data.description}
            onChange={(e) =>
              setData((x) => ({ ...x, description: e.target.value }))
            }
            className="w-full rounded-md h-full py-1 px-3 mt-1 focus:outline-none"
            rows={3}
            placeholder="My Platform"
          />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <ImageComponent
              onDelete={() => {
                setLogoPreview(undefined);
              }}
              onChange={(file) => {
                setLogoPreview(URL.createObjectURL(file));
              }}
              onUploadComplete={(data: string) => {
                setData((x) => ({ ...x, logo: data }));
              }}
              value={logoPreview}
              text="Select Logo"
            />
            <ImageComponent
              onDelete={() => {
                setCoverPreview(undefined);
              }}
              onChange={(file) => {
                setCoverPreview(URL.createObjectURL(file));
              }}
              onUploadComplete={(data: string) => {
                setData((x) => ({ ...x, cover_image: data }));
              }}
              value={coverPreview}
              text="Select Cover"
            />
          </div>

          <AuthWrapper className="w-full h-10 bg-black text-white mt-8 rounded-md">
            <button
              onClick={() => {
                save();
              }}
              className="w-full h-10 bg-black text-white mt-8 rounded-md"
            >
              {loading ? "Creating Platform..." : "Create Platform"}
            </button>
          </AuthWrapper>
        </div>
      </div>
      <div className="w-1/2 h-full">
        <PlatformPlacard
          preview={false}
          platform={{
            ...data,
            cover_image: coverPreview,
            logo: logoPreview,
          }}
        />
      </div>
    </div>
  );
};

const SuccessModal = ({ platformAddress }: { platformAddress: string }) => {
  return (
    <ModalWrapper setOpen={() => {}} open={true}>
      <div className="flex flex-col items-center w-full p-8">
        <div className="text-5xl">🥳</div>
        <div className="text-2xl mt-5">Created Successfully</div>
        <div className="text-gray-500 mt-2">
          Your platform has successfully been created onchain.
        </div>
        <Link href={`/platform/${platformAddress}`}>
          <a className="bg-black h-8 w-full rounded-md text-white mt-8 flex items-center justify-around">
            View Platform Page
          </a>
        </Link>
        <Link href="/">
          <a className="border border-gray-500 h-8 w-full rounded-md mt-2 flex items-center justify-around">
            Return Home
          </a>
        </Link>
      </div>
    </ModalWrapper>
  );
};

const ImageComponent = ({
  text,
  value,
  onChange,
  onDelete,
  onUploadComplete,
}: {
  text: string;
  value?: string;
  onChange: (value: File) => void;
  onDelete: () => void;
  onUploadComplete: (data: string) => void;
}) => {
  const [progress, setProgress] = useState(0);
  const { upload } = useIPFSUpload({
    onUploadComplete,
    onFileProgress: (progess) => {
      if (progess === 1) setProgress(0);
      else setProgress(progess * 100);
    },
  });

  return (
    <div className="flex w-full">
      <div
        className={`bg-gray-200 h-24 w-full flex items-center justify-around rounded-md relative ${styles.logo_view}`}
      >
        {value ? (
          <Fragment>
            <Image
              src={value}
              alt={text}
              height={80}
              width={80}
              className="object-contain w-full h-full p-4"
            />
            {progress > 0 && (
              <div className="absolute text-white top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-around">{`${Math.round(
                progress
              )}%`}</div>
            )}
            <button className="absolute top-1 right-2" onClick={onDelete}>
              <TrashIcon className="h-6 text-red-500" />
            </button>
          </Fragment>
        ) : (
          <label>
            <div className="bg-white flex items-center justify-around cursor-pointer text-gray-500 h-8 w-32 rounded-md text-sm">
              {text}
            </div>
            <input
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onChange(e.target.files[0]);
                  upload(e.target.files[0]);
                }
              }}
              type="file"
              className="hidden"
              placeholder="My Platform"
            />
          </label>
        )}
      </div>

      <div>
        <input type="file" className="hidden" placeholder="My Platform" />
      </div>
    </div>
  );
};

export default CreatePlatform;
