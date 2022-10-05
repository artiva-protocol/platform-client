import { useEffect, useState } from "react";
import { Post } from "@artiva/shared";
import { createContainer } from "unstated-next";
import useSWR from "swr";
import { useAccount } from "wagmi";
import useSetContents, {
  UseSetContentsType,
} from "@/hooks/post/useSetContents";

export type UseCuratorType = {
  collection: Post[];
  setContent: (data: Post) => void;
  set: UseSetContentsType;
};

export type ManagePost = Post & { dirty?: boolean };

const useManageContext = (): UseCuratorType => {
  const { address } = useAccount();

  const { data } = useSWR(
    address
      ? `${process.env.NEXT_PUBLIC_SERVER_BASEURL}/platform/user/${address}/posts`
      : undefined
  );

  const [collection, setCollection] = useState<ManagePost[]>([]);

  const set = useSetContents(collection.filter((x) => x.dirty === true));

  const setContent = (data: Post) => {
    setCollection((x) => {
      const idx = x.findIndex((y) => y.id == data.id);
      if (idx >= 0) x[idx] = { ...data, dirty: true };
      return [...x];
    });
  };

  useEffect(() => {
    if (!data?.posts || collection?.length > 0) return;
    setCollection(data?.posts);
  }, [data?.posts, collection]);

  return {
    collection,
    setContent,
    set,
  };
};

export default createContainer<UseCuratorType>(useManageContext);
