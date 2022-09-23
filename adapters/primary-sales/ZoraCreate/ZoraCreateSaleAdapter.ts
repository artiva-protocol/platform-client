import ERC721Drop from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json";
import { Signer, BigNumberish, ContractTransaction, Contract } from "ethers";
import { Provider } from "@ethersproject/providers";
import { NFTContractObject, PRIMARY_SALE_SOURCES } from "@artiva/shared";
import { MARKET_INFO_STATUSES } from "@zoralabs/nft-hooks/dist/types";
import IPrimarySaleAdapter from "../IPrimarySaleAdapter";

export class ZoraCreateSaleAdapter implements IPrimarySaleAdapter {
  source = PRIMARY_SALE_SOURCES.zoraERC721Drop;
  dropContract?: Contract;

  connect(signerOrProvider: Signer | Provider, address: string) {
    this.dropContract = new Contract(address, ERC721Drop.abi, signerOrProvider);
  }

  purchase = async (
    quantity: BigNumberish,
    value: BigNumberish
  ): Promise<ContractTransaction> => {
    if (!this.dropContract) new Error("Contract not conntected");
    return this.dropContract!.purchase(quantity, { value });
  };

  enabled(contract: NFTContractObject): boolean {
    return !!this.findEdition(contract);
  }

  private findEdition(contract: NFTContractObject) {
    return contract.markets?.find(
      (x) =>
        x.source === PRIMARY_SALE_SOURCES.zoraERC721Drop &&
        x.status === MARKET_INFO_STATUSES.ACTIVE
    );
  }
}

export default new ZoraCreateSaleAdapter();
