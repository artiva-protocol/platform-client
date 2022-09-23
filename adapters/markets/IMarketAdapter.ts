import { NFTObject } from "@zoralabs/nft-hooks";
import { Signer, BigNumberish, ContractTransaction } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainIdentifier } from "@artiva/shared";

export default interface IMarketAdapter {
  connect(signerOrProvider: Signer | Provider, chain: ChainIdentifier): void;
  placeBid(nft: NFTObject, amount: BigNumberish): Promise<ContractTransaction>;
  fillAsk(nft: NFTObject, finder: BigNumberish): Promise<ContractTransaction>;
  offer(nft: NFTObject): Promise<ContractTransaction>;
  enabled(nft: NFTObject): boolean;
}
