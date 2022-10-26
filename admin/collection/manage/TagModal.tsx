import ModalWrapper from "@/components/ModalWrapper";
import ManageContext from "@/context/ManageContext";
import { Post } from "@artiva/shared";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

const TagModal = ({
  open,
  setOpen,
  post,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  post: Post;
}) => {
  const { setPost } = ManageContext.useContainer();
  const [newTag, setNewTag] = useState("");

  const tags = post.tags || [];

  const onAdd = () => {
    if (!post) return;
    const clone = { ...post };
    if (!clone.tags) clone.tags = [newTag];
    else clone.tags.push(newTag);

    setPost(clone);
    setNewTag("");
  };

  const onDelete = (name: string) => {
    const clone = { ...post };
    clone.tags = clone.tags?.filter((x) => x !== name);
    setPost(clone);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="mb-9">
        <div className="text-2xl font-semibold">Manage Tags</div>
        <div className="flex mt-4">
          <input
            className="bg-gray-100 w-full py-1 px-3 rounded-md mr-2 focus:outline-none"
            value={newTag}
            placeholder={"Tag Name"}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button className="focus:outline-none" onClick={onAdd}>
            <PlusCircleIcon className="h-8" />
          </button>
        </div>
        <div className="flex mt-4">
          {tags.map((x) => (
            <div
              key={x}
              className="mr-2 border border-gray-400 rounded-full px-4 text-gray-700 flex items-center"
            >
              <div className="mr-2">{x}</div>
              <button
                onClick={() => {
                  onDelete(x);
                }}
              >
                <XMarkIcon className="h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default TagModal;
