import React, { Fragment } from "react";
import { Post, PostTypeEnum, usePostContent } from "@artiva/shared";
import NFTPreview from "./NFTPreview";
import NFTContractPreview from "./NFTContractPreview";
import CuratorContext from "@/context/CuratorContext";

const PostComponent = ({ post }: { post: Post }) => {
  const { type, content } = post;
  const { nft, nftContract } = usePostContent(type, content);
  const { addContent, collection } = CuratorContext.useContainer();

  const onClick = () => {
    addContent(post);
  };

  let postContent = () => {
    switch (type) {
      case PostTypeEnum.NFT:
        return (
          <NFTPreview
            nft={nft}
            onClick={onClick}
            selected={!!collection.find((x) => x.id === post.id)}
          />
        );
      case PostTypeEnum.NFT_CONTRACT:
        return (
          <NFTContractPreview
            collection={nftContract.collection}
            aggregateStat={nftContract.aggregateStat}
          />
        );
      default:
        return <Fragment />;
    }
  };

  return postContent();
};

export default PostComponent;
