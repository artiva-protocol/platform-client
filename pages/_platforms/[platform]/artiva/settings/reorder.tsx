import AdminLayout from "@/admin/AdminLayout";
import {
  Bars3Icon,
  ChevronRightIcon,
  DocumentIcon,
  Square2StackIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  resetServerContext,
  DropResult,
} from "react-beautiful-dnd";
import MetadataContext from "@/context/MetadataContext";
import MetadataSaveButton from "@/admin/MetadataSaveButton";
import { Post, PostTypeEnum, usePostContent, usePosts } from "@artiva/shared";
import PostPreview from "@/admin/collection/Feed/PostPreview";
import { Fragment, useEffect, useState } from "react";

export const getServerSideProps = async () => {
  resetServerContext();
  return { props: {} };
};

export type PostOrderInstace = Post & { order: number };

const Reorder = () => {
  const { merge } = MetadataContext.useContainer();
  const { data: posts } = usePosts();
  const [dragContext, setDragContext] = useState<PostOrderInstace[]>([]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const clone = [...dragContext];
    const [item] = clone.splice(result.source.index, 1);
    clone.splice(result.destination?.index, 0, item);
    setDragContext(clone);
    merge({
      order: [...clone].reverse().map((x, i) => ({ postId: x.id, order: i })),
    });
  };

  useEffect(() => {
    if (!posts) return;
    if (dragContext.length < 1)
      setDragContext(posts.map((x, i) => ({ ...x, order: i })));
  }, [dragContext, posts]);

  if (!dragContext) return <Fragment />;

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-baseline relative p-6 px-10">
          <div className="flex items-baseline">
            <Link href={"/artiva/settings"}>
              <a className="text-3xl font-bold">Settings</a>
            </Link>
            <ChevronRightIcon className="mx-2 text-gray-400 rounded-md w-6 h-6" />
            <h1 className="text-3xl font-bold">Reorder</h1>
          </div>
          <MetadataSaveButton />
        </div>
        <div className="h-[85vh] overflow-y-auto">
          <div className="flex flex-col px-10">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, _) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {dragContext?.map((x, index) => (
                      <Draggable key={x.id} draggableId={x.id} index={index}>
                        {(provided, _) => (
                          <div
                            className="mt-2"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ReorderPlacard post={x} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const ReorderPlacard = ({ post }: { post: Post }) => {
  const { nft, nftContract } = usePostContent(post.type, post.content);
  return (
    <div className="flex bg-black rounded-md w-full">
      <div className="h-20 w-20 p-2">
        <PostPreview
          post={post}
          selected={false}
          renderingContext={"THUMBNAIL"}
        />
      </div>
      <div className="flex items-stretch justify-between w-full">
        <div className="ml-4 mt-2 text-sm">
          <div className="text-white font-semibold">
            {nft?.metadata?.name || nftContract?.collection.name}
          </div>
          <div className="flex items-center">
            {post.type === PostTypeEnum.NFT ? (
              <DocumentIcon className="text-gray-300 h-4" />
            ) : (
              <Square2StackIcon className="text-gray-300 h-4" />
            )}
            <div className=" text-gray-300 ml-1">{post.type}</div>
          </div>
        </div>
        <div>
          <Bars3Icon className="text-gray-300 h-6 mr-4 mt-6 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Reorder;