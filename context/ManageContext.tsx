import { useEffect, useState } from "react";
import { Post, usePosts } from "@artiva/shared";
import { createContainer } from "unstated-next";
import { useAccount } from "wagmi";
import useSetContents, {
  UseSetContentsType,
} from "@/hooks/post/useSetContents";
import { useRouter } from "next/router";

export type UseCuratorType = {
  collection: Post[];
  setPost: (data: Post) => void;
  loadMore: () => void;
  save: UseSetContentsType;
  more: boolean;
  loading: boolean;
};

export type ManagePost = Post & { dirty?: boolean };

const useManageContext = (): UseCuratorType => {
  const {
    query: { platform },
  } = useRouter();
  const { address } = useAccount();

  const {
    data: posts,
    more,
    size,
    setSize,
    loading,
  } = usePosts({ platform: platform as string, owner: address });

  const [collection, setCollection] = useState<ManagePost[]>([]);

  const save = useSetContents(collection.filter((x) => x.dirty === true));

  const setPost = (data: Post) => {
    setCollection((x) => {
      const idx = x.findIndex((y) => y.id == data.id);
      if (idx >= 0) x[idx] = { ...data, dirty: true };
      return [...x];
    });
  };

  const loadMore = () => {
    setSize(size + 1);
  };

  useEffect(() => {
    if (!posts || collection.length > 0) return;
    setCollection(posts.flat());
  }, [posts]);

  useEffect(() => {
    if (!posts || size < 2 || loading) return;
    setCollection((x) => [...x, ...posts[size - 1]]);
  }, [size, posts, loading]);

  return {
    collection,
    setPost,
    loadMore,
    save,
    more,
    loading,
  };
};

export default createContainer<UseCuratorType>(useManageContext);
