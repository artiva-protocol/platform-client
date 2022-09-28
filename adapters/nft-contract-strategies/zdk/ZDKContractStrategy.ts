import { NetworkIDs } from "@zoralabs/nft-hooks";
import { Network } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { ZDK } from "@zoralabs/zdk";
import { NFTContractObject } from "@artiva/shared";
import { ContractFetchInfo, NFTContractStrategy } from "../NFTContractStrategy";
import ZoraCreateDataSource from "adapters/backends/zora-create/ZoraCreateDataSource";

export default class ZDKContractStrategy extends NFTContractStrategy {
  networkId: NetworkIDs;
  zdk: ZDK;
  zoraCreate: ZoraCreateDataSource;

  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.networkId = networkId;
    this.zdk = new ZDK({
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
    this.zoraCreate = new ZoraCreateDataSource(networkId);
  }

  hasSecondaryData = (_: ContractFetchInfo) => true;

  fetchNFTContract = async (address: string): Promise<NFTContractObject> => {
    const collectionQuery = this.zdk.collection({ address });
    const statQuery = this.zdk.collectionStatsAggregate({
      collectionAddress: address,
      network: { network: "ETHEREUM" as Network },
    });
    const res = await Promise.all([collectionQuery, statQuery]);
    return {
      collection: res[0],
      aggregateStat: res[1].aggregateStat,
      markets: [],
      rawData: {
        ZDK: {
          collection: res[0],
          aggregateStat: res[1].aggregateStat,
        },
      },
    };
  };

  async fetchSecondaryData(
    address: string,
    current?: NFTContractObject
  ): Promise<NFTContractObject> {
    if (!current)
      current = {
        rawData: {},
        collection: {
          address,
        },
      };

    try {
      const market = await this.zoraCreate.loadEdition(address);
      return {
        ...current,
        markets: [market],
      };
    } catch (err) {
      console.log("Error fetching edition data", err);
    }

    return current;
  }
}
