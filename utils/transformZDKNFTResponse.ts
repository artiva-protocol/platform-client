import { PostRequest } from "@/hooks/post/useAddContents";
import { PostTypeEnum } from "@artiva/shared";

const transformZDKNFTResponse = (data: any[]): PostRequest[] => {
  return data?.map((x) => ({
    content: {
      chain: "ETHEREUM",
      tokenId: x.tokenId,
      contractAddress: x.collectionAddress,
    },
    type: PostTypeEnum.NFT,
  }));
};

export default transformZDKNFTResponse;
