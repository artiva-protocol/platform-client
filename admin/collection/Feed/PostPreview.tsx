import React, { Fragment } from "react";
import { Post, PostTypeEnum, usePostContent } from "@artiva/shared";
import NFTPreview from "./NFTPreview";
import NFTContractPreview from "./NFTContractPreview";
import { PostRequest } from "@/hooks/post/useAddContents";

const PostPreview = ({
  post,
  selected,
  onClick,
}: {
  post: Post | PostRequest;
  selected: boolean;
  onClick?: () => void;
}) => {
  const { type, content } = post;
  const { nft, nftContract } = usePostContent(type, content);

  let postContent = () => {
    switch (type) {
      case PostTypeEnum.NFT:
        return <NFTPreview nft={nft} onClick={onClick} selected={selected} />;
      case PostTypeEnum.NFT_CONTRACT:
        return (
          <NFTContractPreview
            collection={nftContract?.collection}
            aggregateStat={nftContract?.aggregateStat}
          />
        );
      default:
        return <Fragment />;
    }
  };

  return postContent();
};

export default PostPreview;
