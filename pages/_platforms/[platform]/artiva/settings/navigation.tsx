import AdminLayout from "@/admin/AdminLayout";
import {
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import { Navigation } from "@artiva/shared";
import Link from "next/link";
import MetadataContext from "@/context/MetadataContext";
import MetadataSaveButton from "@/admin/MetadataSaveButton";
import { cloneDeep } from "lodash";

const placardOuterStyle = "flex mt-4";
const labelStyle =
  "w-2/3 h-10 px-2 text-sm text-gray-800 mr-2 focus:outline-none rounded-sm";
const urlStyle =
  "w-full h-10 px-2 text-sm text-gray-600 mr-2 focus:outline-none rounded-sm";

const Navigation = () => {
  const { data, mutate } = MetadataContext.useContainer();

  const onChange = (idx: number, key: string, value: string) => {
    if (!data || !data.navigation) return;
    const clone = cloneDeep(data);
    (clone.navigation![idx] as any)[key] = value;
    mutate(clone);
  };

  const onAdd = (label: string, url: string, secondary: boolean) => {
    if (!data) return;
    const clone = cloneDeep(data);
    if (!clone.navigation) clone.navigation = [];
    clone.navigation.push({
      label,
      url,
      secondary,
    });
    mutate(clone);
  };

  const onRemove = (idx: number) => {
    if (!data || !data.navigation) return;
    const clone = cloneDeep(data);
    clone.navigation!.splice(idx, 1);
    mutate(clone);
  };

  return (
    <AdminLayout>
      <div className="w-full p-6 px-10 relative">
        <div className="flex justify-between items-baseline">
          <div className="flex items-baseline">
            <Link href={"/artiva/settings"}>
              <a className="text-3xl font-bold">Settings</a>
            </Link>
            <ChevronRightIcon className="mx-2 text-gray-400 w-6 h-6" />
            <h1 className="text-3xl font-bold">Navigation</h1>
          </div>
          <MetadataSaveButton />
        </div>

        <div className="text-sm mt-12">Primary navigation</div>
        <div className="bg-gray-100 p-6 mt-3">
          {data?.navigation?.map((x, i) => {
            if (x.secondary) return <Fragment />;
            return (
              <EditPlacard
                key={i}
                {...x}
                idx={i}
                onChange={onChange}
                onRemove={onRemove}
              />
            );
          })}
          <AddPlacard
            onAdd={(label: string, url: string) => {
              onAdd(label, url, false);
            }}
          />
        </div>

        <div className="text-sm mt-12">Secondary navigation</div>
        <div className="bg-gray-100 p-6 mt-3">
          {data?.navigation?.map((x, i) => {
            if (!x.secondary) return <Fragment />;
            return (
              <EditPlacard
                key={i}
                {...x}
                idx={i}
                onChange={onChange}
                onRemove={onRemove}
              />
            );
          })}
          <AddPlacard
            onAdd={(label: string, url: string) => {
              onAdd(label, url, true);
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

const EditPlacard = ({
  idx,
  label,
  url,
  onChange: onChangeParent,
  onRemove,
}: Partial<Navigation> & {
  idx: number;
  onChange: (idx: number, key: string, value: string) => void;
  onRemove: (idx: number) => void;
}) => {
  const onChange = (key: string, value: string) =>
    onChangeParent(idx, key, value);

  return (
    <div className={placardOuterStyle}>
      <input
        value={label}
        className={labelStyle}
        onChange={(e) => {
          onChange("label", e.target.value);
        }}
      />
      <input
        value={url}
        className={urlStyle}
        onChange={(e) => {
          onChange("url", e.target.value);
        }}
      />
      <button
        onClick={() => {
          onRemove(idx);
        }}
      >
        <TrashIcon className="w-6 h-6 text-gray-300" />
      </button>
    </div>
  );
};

const AddPlacard = ({
  onAdd: onAddParent,
}: {
  onAdd: (url: string, label: string) => void;
}) => {
  const [label, setLabel] = useState("");
  const [url, setURL] = useState(
    typeof window !== "undefined" ? window?.location?.origin : ""
  );

  const onAdd = () => {
    onAddParent(label, url);
    setLabel("");
    setURL(window?.location?.origin);
  };

  return (
    <div className={placardOuterStyle}>
      <input
        className={labelStyle}
        placeholder="Label"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
        }}
      />
      <input
        className={urlStyle}
        value={url}
        onChange={(e) => {
          if (!e.target.value) setURL(window.location.host);
          else setURL(e.target.value);
        }}
      />
      <button onClick={onAdd}>
        <PlusIcon className="w-6 h-6 bg-green-500 text-white p-1 rounded-sm" />
      </button>
    </div>
  );
};

export default Navigation;
