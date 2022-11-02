import { Signer, BigNumberish, ContractTransaction, BigNumber } from "ethers";
import { Provider } from "@ethersproject/providers";
import { NFTContractObject, PRIMARY_SALE_SOURCES } from "@artiva/shared";
import { MARKET_INFO_STATUSES } from "@zoralabs/nft-hooks/dist/types";
import IPrimarySaleAdapter from "../IPrimarySaleAdapter";
import { MintSchedule, SoundClient } from "@soundxyz/sdk";
import { SoundAPI } from "@soundxyz/sdk/api";

export class SoundXYZSaleAdapter implements IPrimarySaleAdapter {
  source = PRIMARY_SALE_SOURCES.soundXYZ;
  client?: SoundClient;
  schedule?: MintSchedule;

  async connect(signerOrProvider: Signer | Provider, address: string) {
    if (!("signTransaction" in signerOrProvider)) return;
    const soundAPI = SoundAPI({
      apiKey: process.env.NEXT_PUBLIC_SOUND_XYZ_API_KEY,
    });
    this.client = SoundClient({ signer: signerOrProvider, soundAPI });
    this.schedule = await this.client
      .activeMintSchedules({
        editionAddress: address,
      })
      .then((x) => x.shift());
  }

  purchase = async (
    quantity: BigNumberish,
    _: BigNumberish
  ): Promise<ContractTransaction> => {
    if (!this.schedule) throw Error("No mint schedule found");
    const res = await this.client?.mint({
      mintSchedule: this.schedule,
      quantity: BigNumber.from(quantity).toNumber(),
    });
    if (!res) throw new Error("Error clinet minting failed");
    return res;
  };

  enabled(contract: NFTContractObject): boolean {
    return !!this.findEdition(contract);
  }

  private findEdition(contract: NFTContractObject) {
    return contract.markets?.find(
      (x) =>
        x.source === PRIMARY_SALE_SOURCES.soundXYZ &&
        x.status === MARKET_INFO_STATUSES.ACTIVE
    );
  }
}

export default new SoundXYZSaleAdapter();
