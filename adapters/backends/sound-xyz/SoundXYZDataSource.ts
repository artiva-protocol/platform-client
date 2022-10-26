import {
  EditionContractLike,
  PrimarySaleModule,
  PRIMARY_SALE_SOURCES,
  PRIMARY_SALE_TYPES,
} from "@artiva/shared";
import { AlchemyProvider } from "@ethersproject/providers";
import { MintSchedule, SoundClient } from "@soundxyz/sdk";
import { SoundAPI } from "@soundxyz/sdk/api";
import { NetworkIDs } from "@zoralabs/nft-hooks";
import { MARKET_INFO_STATUSES } from "@zoralabs/nft-hooks/dist/types";
import DataLoader from "dataloader";
import { BigNumber } from "ethers";
import { compareAddress } from "utils/compareAddress";

export class SoundXYZDataSource {
  networkId: NetworkIDs;
  client?: SoundClient;
  dataloader: DataLoader<string, PrimarySaleModule[]>;
  MAX_SIZE = 50;

  constructor(networkId: NetworkIDs) {
    this.networkId = networkId;
    const soundAPI = SoundAPI({
      apiKey: process.env.NEXT_PUBLIC_SOUND_XYZ_API_KEY,
    });
    const provider = new AlchemyProvider(
      1,
      process.env.NEXT_PUBLIC_ALCHEMY_KEY
    );
    this.client = SoundClient({
      soundAPI,
      provider,
    });
    this.dataloader = new DataLoader(this.fetchEditions);
  }

  loadEdition = (address: string) => {
    return this.dataloader.load(address);
  };

  transformEdition = (schedules: MintSchedule[]): EditionContractLike[] => {
    return schedules.map((x) => ({
      contractAddress: x.editionAddress,
      source: PRIMARY_SALE_SOURCES.soundXYZ,
      status: MARKET_INFO_STATUSES.ACTIVE,
      type:
        x.mintType == "MerkleDrop"
          ? PRIMARY_SALE_TYPES.PresaleEdition
          : PRIMARY_SALE_TYPES.PublicEdition,
      price: x.price.toString(),
      maxSupply:
        typeof x.maxMintable == "number"
          ? x.maxMintable
          : x.maxMintable(Date.now()),
      startTime: x.startTime.toString(),
      endTime: ("cutoffTime" in x ? x.cutoffTime : x.endTime).toString(),
      raw: x,
    }));
  };

  fetchEditions = async (
    addresses: readonly string[]
  ): Promise<(PrimarySaleModule[] | Error)[]> => {
    const schedules = await Promise.all(
      addresses.map((x) =>
        this.client!.activeMintSchedules({ editionAddress: x })
      )
    );

    const full = schedules
      .map((result) => this.transformEdition(result))
      .flat();

    return addresses.map(
      (address) =>
        full
          .filter((x) => compareAddress(address, x.contractAddress))
          .sort((a, b) =>
            BigNumber.from(b.endTime).sub(BigNumber.from(a.endTime)).toNumber()
          ) || new Error("No asset")
    );
  };
}
