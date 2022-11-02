import { NFTContractIdentifier, NFTContractObject } from "@artiva/shared";
import { ArtivaClientConfig } from "configs/artiva-client-config";

export const getNFTContractPrimaryData = async (
  contract: NFTContractIdentifier
): Promise<NFTContractObject | undefined> => {
  if (!contract || !contract.chain || !contract.contractAddress) return;
  const strategy = await ArtivaClientConfig.getNFTContractStrategy?.(
    contract.chain
  );
  return strategy?.fetchNFTContract(contract.contractAddress);
};

export const getNFTContractSecondaryData = async (
  contract: NFTContractIdentifier
): Promise<NFTContractObject | undefined> => {
  if (!contract || !contract.chain || !contract.contractAddress) return;
  const strategy = await ArtivaClientConfig.getNFTContractStrategy?.(
    contract.chain
  );
  return strategy?.fetchSecondaryData(contract.contractAddress);
};
