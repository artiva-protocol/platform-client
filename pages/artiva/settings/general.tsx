import AdminLayout from "@/admin/AdminLayout";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/solid";
import useSaveMetadata from "hooks/platform/useSaveMetadata";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Platform } from "@artiva/shared";
import useSWR from "swr";
import axios from "axios";
import styles from "@/styles/Upload.module.css";
import ProtocolSaveToast from "@/components/ProtocolSaveToast";

const titleStyle = "font-semibold";
const subtitleStyle = "font-semibold text-sm text-gray-600";

const captionStyle = "text-xs font-light text-gray-600 mt-1";
const lowerCaptionStyle = "text-xs font-light text-gray-600 mt-3";
const inputStyle =
  "w-3/4 py-2 px-4 text-gray-600 rounded-sm text-sm focus:outline-none";

const General = () => {
  const { data } = useSWR(
    process.env.NEXT_PUBLIC_SERVER_BASEURL + "/platform/meta"
  );

  const [platform, setPlatform] = useState<Platform | undefined>();

  const save = useSaveMetadata({ data: platform });

  useEffect(() => {
    if (!platform && data) setPlatform(data.platform);
  }, [data]);

  const onChange = (key: string, value: any) => {
    setPlatform((x: any) => {
      const tmp = { ...x };
      tmp[key] = value;
      return tmp;
    });
  };

  return (
    <AdminLayout>
      <div className="w-full mt-4">
        <div className="flex justify-between items-baseline p-6 relative">
          <div className="flex items-baseline px-10">
            <Link href={"/artiva/settings"}>
              <a className="text-3xl font-bold">Settings</a>
            </Link>
            <ChevronRightIcon className="mx-2 text-gray-400 rounded-md w-6 h-6" />
            <h1 className="text-3xl font-bold">General</h1>
          </div>
          <button
            onClick={() => {
              save.save();
            }}
            className="bg-black text-white w-24 h-8 rounded-md text-sm"
          >
            Save
          </button>
          <div className="absolute top-20 right-6">
            <ProtocolSaveToast {...save} />
          </div>
        </div>

        <div className="overflow-y-auto h-[84vh] pb-4">
          <div className="px-16 mt-12">
            <div className="text-sm">Platform Info</div>
            <div className="bg-gray-100 rounded-md p-6 mt-3">
              <div className={titleStyle}>Title and Description</div>
              <div className={captionStyle}>
                The details used to identify your platform around the web
              </div>

              <div className="mt-6">
                <input
                  className={inputStyle}
                  onChange={(e) => onChange("title", e.target.value)}
                  value={platform?.title}
                />
                <div className={lowerCaptionStyle}>The name of your site</div>
              </div>

              <div className="mt-6">
                <input
                  className={inputStyle}
                  onChange={(e) => onChange("description", e.target.value)}
                  value={platform?.description}
                />
                <div className={lowerCaptionStyle}>
                  Description used in themes and metadata
                </div>
              </div>
            </div>
          </div>

          <div className="px-16 mt-12">
            <div className="text-sm">Meta Settings</div>
            <div className="bg-gray-100 p-6 mt-3">
              <div className={titleStyle}>Meta data</div>
              <div className={captionStyle}>Content for search engines</div>

              <div className="mt-6">
                <div className={subtitleStyle}>Meta title</div>
                <input
                  placeholder={platform?.title}
                  className={inputStyle + " mt-1"}
                  value={platform?.meta_title}
                  onChange={(e) => onChange("meta_title", e.target.value)}
                />
              </div>

              <div className="mt-6">
                <div className={subtitleStyle}>Meta description</div>
                <input
                  placeholder={platform?.description}
                  className={inputStyle + " mt-1"}
                  value={platform?.meta_description}
                  onChange={(e) => onChange("meta_description", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="px-16 mt-2">
            <div className="bg-gray-100 p-6">
              <div className={titleStyle}>Twitter card</div>
              <div className={captionStyle}>
                Customize your site data for Twitter
              </div>

              <div className="mt-6">
                <ImageElement
                  id="twitter_image"
                  title="Twitter image"
                  buttonText="Add Twitter image"
                  value={platform?.twitter_image}
                  onChange={(value) => onChange("twitter_image", value)}
                />
              </div>

              <div className="mt-6">
                <div className={subtitleStyle}>Twitter title</div>
                <input
                  placeholder={platform?.title}
                  className={inputStyle + " mt-1"}
                  value={platform?.twitter_title}
                  onChange={(e) => onChange("twitter_title", e.target.value)}
                />
              </div>

              <div className="mt-6">
                <div className={subtitleStyle}>Twitter description</div>
                <input
                  placeholder={platform?.description}
                  className={inputStyle + " mt-1"}
                  value={platform?.twitter_description}
                  onChange={(e) =>
                    onChange("twitter_description", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export type ImageElementProps = {
  id: string;
  title: string;
  description?: string;
  buttonText?: string;
  value?: string;
  onChange: (value: string | null) => void;
};

const ImageElement = ({
  id,
  title,
  description,
  buttonText,
  value,
  onChange,
}: ImageElementProps) => {
  const baseURL = process.env.NEXT_PUBLIC_SERVER_BASEURL!;
  const onFile = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("name", id);
    formData.append("file", file);

    const { data } = await axios.post(baseURL + "/upload/image", formData);

    onChange(data);
  };

  const onDelete = () => {
    onChange(null);
  };

  return (
    <div className="w-1/2">
      <div className="text-sm font-semibold">{title}</div>
      {description && (
        <div className="text-gray-500 text-sm mt-1">{description}</div>
      )}
      {value ? (
        <div
          className={`h-full mt-2 flex items-centerbg-gray-100 w-full relative ${styles.logo_view}`}
        >
          <img src={value} className="w-full object-cover" />
          <button
            onClick={onDelete}
            className="absolute top-2 right-3 bg-black w-7 h-7 flex items-center justify-around rounded-md hover:bg-red-500"
          >
            <TrashIcon className="h-5 text-white" />
          </button>
        </div>
      ) : (
        <label htmlFor={id}>
          <div className="bg-white w-40 h-8 rounded-md mt-2 shadow-sm text-sm flex items-center justify-around cursor-pointer">
            {buttonText}
          </div>
          <input
            id={id}
            type="file"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.item(0) || undefined);
            }}
          />
        </label>
      )}
    </div>
  );
};

export default General;
