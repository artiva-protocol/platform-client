import usePublishPost, { UsePublishPostType } from "hooks/post/usePublishPost";
import { useEffect, useState } from "react";
import { Post } from "@artiva/shared";
import { createContainer } from "unstated-next";
import useSWR from "swr";
import { useAccount } from "wagmi";

export type UseCuratorType = {
  collection: Post[];
  addContent: (data: Post) => void;
  setContent: (data: Post) => void;
  publish: UsePublishPostType;
};

const useCurator = (): UseCuratorType => {
  const { address } = useAccount();

  const { data } = useSWR(
    address
      ? `${process.env.NEXT_PUBLIC_SERVER_BASEURL}/platform/user/${address}/posts`
      : undefined
  );

  const [fullCollection, setFullCollection] = useState<Post[]>([]);
  const [newCollection, setNewCollection] = useState<Post[]>([]);

  const publish = usePublishPost(newCollection);

  const addContent = (data: Post) => {
    setNewCollection((x) => [...x, data]);
    setFullCollection((x) => [...x, data]);
  };

  const setContent = (data: Post) => {
    setFullCollection((x) => {
      const idx = x.findIndex((y) => y.id == data.id);
      if (idx >= 0) x[idx] = data;
      return [...x];
    });
  };

  useEffect(() => {
    if (!data?.posts || fullCollection?.length > 0) return;
    setFullCollection(data?.posts);
  }, [data?.posts, fullCollection]);

  return {
    collection: fullCollection,
    addContent,
    setContent,
    publish,
  };
};

export default createContainer<UseCuratorType>(useCurator);
