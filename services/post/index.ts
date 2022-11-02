import {
  NFTContractObject,
  NFTIdentifier,
  Post,
  PostTypeEnum,
} from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import { getNFTPrimaryData } from "../nft";
import { getNFTContractPrimaryData } from "../nft-contract";

export type PostData = NFTContractObject | NFTObject | undefined;

export const getPostPrimaryData = (post: Post): Promise<PostData> => {
  return post.type === PostTypeEnum.NFT_CONTRACT
    ? getNFTContractPrimaryData(post.content)
    : getNFTPrimaryData(post.content as NFTIdentifier);
};
