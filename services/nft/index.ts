import { NFTIdentifier } from "@artiva/shared";
import { NFTObject } from "@zoralabs/nft-hooks";
import { ArtivaClientConfig } from "configs/artiva-client-config";

export const getNFTPrimaryData = async (
  nft: NFTIdentifier
): Promise<NFTObject | undefined> => {
  if (!nft || !nft.chain || !nft.tokenId) return;
  const strategy = await ArtivaClientConfig.getNFTStrategy?.(nft.chain);
  return strategy?.fetchNFT(nft.contractAddress, nft.tokenId);
};

export const getNFTSecondaryData = async (
  nft: NFTIdentifier
): Promise<NFTObject | undefined> => {
  if (!nft || !nft.chain || !nft.tokenId) return;
  const strategy = await ArtivaClientConfig.getNFTStrategy?.(nft.chain);
  return strategy?.fetchSecondaryData(nft.contractAddress, nft.tokenId);
};
