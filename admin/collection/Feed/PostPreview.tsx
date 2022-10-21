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
  showDetails = true,
}: {
  post: Post | PostRequest;
  selected?: boolean;
  onClick?: () => void;
  renderingContext?: "FULL" | "PREVIEW" | "THUMBNAIL";
  showDetails?: boolean;
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
            showDetails={showDetails}
          />
        );
      case PostTypeEnum.NFT_CONTRACT:
        return (
          <NFTContractPreview
            nftContract={nftContract}
            renderingContext={renderingContext}
            showDetails={showDetails}
          />
        );
      default:
        return <Fragment />;
    }
  };

  return postContent();
};

export default PostPreview;
