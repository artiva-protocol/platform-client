import usePublishPost, { UsePublishPostType } from "hooks/post/usePublishPost";
import { useEffect, useState } from "react";
import { Post } from "@artiva/shared";
import { createContainer } from "unstated-next";
import useSWR from "swr";
import { useAccount } from "wagmi";

export type UseCuratorType = {
  collection: Post[];
  addContent: (data: Post) => void;
  publish: UsePublishPostType;
};

const useCurator = (): UseCuratorType => {
  const { address } = useAccount();

  const { data } = useSWR(
    address
      ? `${process.env.NEXT_PUBLIC_SERVER_BASEURL}/platform/user/${address}/posts`
      : undefined,
    null,
    { refreshInterval: 2000000, errorRetryInterval: 2000000 }
  );

  const [fullCollection, setFullCollection] = useState<Post[]>([]);
  const [newCollection, setNewCollection] = useState<Post[]>([]);

  const publish = usePublishPost(newCollection);

  const addContent = (data: Post) => {
    setNewCollection((x) => [...x, data]);
    setFullCollection((x) => [...x, data]);
  };

  useEffect(() => {
    if (!data?.posts || fullCollection?.length > 0) return;
    setFullCollection(data?.posts);
  }, [data?.posts, fullCollection]);

  return {
    collection: fullCollection,
    addContent,
    publish,
  };
};

export default createContainer<UseCuratorType>(useCurator);
