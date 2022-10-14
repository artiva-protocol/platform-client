import ModalWrapper from "@/components/ModalWrapper";
import DesignerContext from "@/context/DesignerContext";
import {
  ChevronLeftIcon,
  ArrowPathIcon,
  SparklesIcon,
  GlobeAltIcon,
  HomeIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import BrandSettings from "./Sections/BrandSettings";
import DesignNavElement from "./DesignNavElement";
import ThemeModal from "./ThemeModal";
import GroupSection from "./Sections/GroupSection";

const DesignNavigation = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { customProperties } = DesignerContext.useContainer();
  const custom = useMemo(() => {
    return {
      sitewide: customProperties?.filter((x) => !x.group),
      homepage: customProperties?.filter((x) => x.group === "homepage"),
      post: customProperties?.filter((x) => x.group === "post"),
    };
  }, [customProperties]);

  return (
    <div className="border-r h-screen relative" style={{ width: "400px" }}>
      <button
        onClick={() => {
          router.push("/artiva/settings");
        }}
        className="flex items-center px-8 pt-8"
      >
        <ChevronLeftIcon className="w-4 mr-1" />
        <div className="text-sm text-gray-700">Settings</div>
      </button>

      <div className="mt-12 overflow-y-auto" style={{ height: "74vh" }}>
        <div className="font-semibold px-8 ">Site Design</div>

        <DesignNavElement
          navId="brand"
          title="Brand"
          icon={<SparklesIcon className="w-5 text-gray-600" />}
          selected={selected}
          setSelected={setSelected}
        />
        {selected === "brand" && <BrandSettings />}

        {!!custom.sitewide?.length && (
          <Fragment>
            <DesignNavElement
              navId="sitewide"
              title="Site-wide"
              icon={<GlobeAltIcon className="w-5 text-gray-600" />}
              selected={selected}
              setSelected={setSelected}
            />
            {selected === "sitewide" && (
              <GroupSection settings={custom.sitewide} />
            )}
          </Fragment>
        )}

        {!!custom.homepage?.length && (
          <Fragment>
            <DesignNavElement
              navId="homepage"
              title="Homepage"
              icon={<HomeIcon className="w-5 text-gray-600" />}
              selected={selected}
              setSelected={setSelected}
            />
            {selected === "homepage" && (
              <GroupSection settings={custom.homepage} />
            )}
          </Fragment>
        )}

        {!!custom.post?.length && (
          <Fragment>
            <DesignNavElement
              navId="post"
              title="Post"
              icon={<DocumentIcon className="w-5 text-gray-600" />}
              selected={selected}
              setSelected={setSelected}
            />
            {selected === "post" && <GroupSection settings={custom.post} />}
          </Fragment>
        )}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="absolute bottom-0 left-0 px-6 h-20 hover:bg-gray-100 w-full text-left flex items-center justify-between"
      >
        <div>
          <div className="text-sm font-semibold">Change Theme</div>
          <div className="text-sm text-gray-400">
            Current: baseline - v0.0.1
          </div>
        </div>
        <ArrowPathIcon className="h-4 text-gray-400" />
      </button>

      <ModalWrapper open={modalOpen} setOpen={setModalOpen}>
        <ThemeModal setOpen={setModalOpen} />
      </ModalWrapper>
    </div>
  );
};

export default DesignNavigation;
