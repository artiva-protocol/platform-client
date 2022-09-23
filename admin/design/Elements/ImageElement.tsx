import { Fragment, useState } from "react";
import styles from "@/styles/Upload.module.css";
import { TrashIcon } from "@heroicons/react/24/solid";
import useIPFSUpload from "@/hooks/ipfs/useIPFSUpload";
import Image from "next/future/image";

export type ImageElementProps = {
  title: string;
  description?: string;
  buttonText?: string;
  value?: string;
  onChange: (value: string | null) => void;
};

const ImageElement = ({
  title,
  description,
  buttonText = "Upload",
  value,
  onChange,
}: ImageElementProps) => {
  const [progress, setProgress] = useState(0);
  const { upload } = useIPFSUpload({
    onUploadComplete: (data: string) => {
      onChange(data);
    },
    onFileProgress: (progess: number) => {
      if (progess === 1) setProgress(0);
      else setProgress(progess * 100);
    },
  });

  const onFile = async (file?: File) => {
    if (!file) return;
    upload(file);
  };

  const onDelete = () => {
    onChange(null);
  };

  return (
    <Fragment>
      <div className="text-sm font-semibold">{title}</div>
      {description && (
        <div className="text-gray-500 text-sm mt-1">{description}</div>
      )}
      {value ? (
        <div
          className={`h-16 mt-2 flex items-center justify-around bg-gray-100 w-full relative ${styles.logo_view}`}
        >
          <Image
            alt="image upload"
            height={200}
            width={200}
            src={value}
            className="h-10 object-scale-down"
          />
          <button
            onClick={onDelete}
            className="absolute top-2 right-3 bg-black w-7 h-7 flex items-center justify-around rounded-md hover:bg-red-500"
          >
            <TrashIcon className="h-5 text-white" />
          </button>
        </div>
      ) : (
        <label>
          <div className="bg-white w-28 h-8 rounded-md mt-2 shadow-sm text-sm flex items-center justify-around cursor-pointer">
            {progress > 0 ? `${Math.round(progress)}%` : buttonText}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              onFile(e.target.files?.item(0) || undefined);
            }}
          />
        </label>
      )}
    </Fragment>
  );
};

export default ImageElement;
