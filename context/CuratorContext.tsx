import useAddContents, {
  PostRequest,
  UseAddContentsType,
} from "@/hooks/post/useAddContents";
import { useState } from "react";
import useSWR from "swr";
import { createContainer } from "unstated-next";
import { useAccount } from "wagmi";

export type UseCuratorType = {
  collection: PostRequest[];
  addContent: (data: PostRequest) => void;
  add: UseAddContentsType;
};

const useCurator = (): UseCuratorType => {
  const { address } = useAccount();
  const { data } = useSWR(
    address
      ? `${process.env.NEXT_PUBLIC_SERVER_BASEURL}/platform/user/${address}/posts`
      : undefined
  );
  const [collection, setCollection] = useState<PostRequest[]>([]);

  const add = useAddContents(collection);

  const addContent = (data: PostRequest) => {
    setCollection((x) => [...x, data]);
  };

  return {
    collection: data?.posts ? [...data.posts, ...collection] : collection,
    addContent,
    add,
  };
};

export default createContainer<UseCuratorType>(useCurator);
