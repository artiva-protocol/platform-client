import React, { Fragment } from "react";
import { Post, PostTypeEnum, usePostContent } from "@artiva/shared";
import NFTPreview from "./NFTPreview";
import NFTContractPreview from "./NFTContractPreview";
import { PostRequest } from "@/hooks/post/useAddContents";

const PostPreview = ({
  post,
  selected = false,
  onClick,
  renderingContext = "PREVIEW",
}: {
  post: Post | PostRequest;
  selected?: boolean;
  onClick?: () => void;
  renderingContext?: "FULL" | "PREVIEW" | "THUMBNAIL";
}) => {
  const { type, content } = post;
  const { nft, nftContract } = usePostContent(type, content);

  let postContent = () => {
    switch (type) {
      case PostTypeEnum.NFT:
        return (
          <NFTPreview
            nft={nft}
            onClick={onClick}
            selected={selected}
            renderingContext={renderingContext}
          />
        );
      case PostTypeEnum.NFT_CONTRACT:
        return (
          <NFTContractPreview
            nftContract={nftContract}
            renderingContext={renderingContext}
          />
        );
      default:
        return <Fragment />;
    }
  };

  return postContent();
};

export default PostPreview;
