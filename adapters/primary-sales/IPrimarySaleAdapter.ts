import { Signer, BigNumberish, ContractTransaction } from "ethers";
import { Provider } from "@ethersproject/providers";
import { NFTContractObject, PRIMARY_SALE_SOURCES } from "@artiva/shared";

export default interface IPrimarySaleAdapter {
  source: PRIMARY_SALE_SOURCES;
  connect(signerOrProvider: Signer | Provider, address: string): void;
  purchase(
    quantity: BigNumberish,
    amount: BigNumberish
  ): Promise<ContractTransaction>;
  enabled(contract: NFTContractObject): boolean;
}
