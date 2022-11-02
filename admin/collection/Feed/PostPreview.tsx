import React, { Fragment } from "react";
import {
  NFTContractObject,
  Post,
  PostTypeEnum,
  usePostContent,
} from "@artiva/shared";
import NFTPreview from "./NFTPreview";
import NFTContractPreview from "./NFTContractPreview";
import { PostRequest } from "@/hooks/post/useAddContents";
import { NFTObject } from "@zoralabs/nft-hooks";

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
  const { type } = post;
  const { data } = usePostContent(post as Post);

  let postContent = () => {
    switch (type) {
      case PostTypeEnum.NFT:
        return (
          <NFTPreview
            nft={data as NFTObject}
            onClick={onClick}
            selected={selected}
            renderingContext={renderingContext}
            showDetails={showDetails}
          />
        );
      case PostTypeEnum.NFT_CONTRACT:
        return (
          <NFTContractPreview
            nftContract={data as NFTContractObject}
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
