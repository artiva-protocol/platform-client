import { NetworkIDs } from "@zoralabs/nft-hooks";
import { Network, Chain } from "@zoralabs/zdk/dist/queries/queries-sdk";
import { ZDK } from "@zoralabs/zdk";
import { NFTContractObject } from "@artiva/shared";
import { ContractFetchInfo, NFTContractStrategy } from "../NFTContractStrategy";
import ZoraCreateDataSource from "adapters/backends/zora-create/ZoraCreateDataSource";
import { SoundXYZDataSource } from "adapters/backends/sound-xyz/SoundXYZDataSource";

export default class ZDKContractStrategy extends NFTContractStrategy {
  networkId: NetworkIDs;
  zdk: ZDK;
  zoraCreate: ZoraCreateDataSource;
  soundXYZ: SoundXYZDataSource;

  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.networkId = networkId;
    this.zdk = new ZDK({
      apiKey: process.env.NEXT_PUBLIC_ZORA_API_KEY,
    });
    this.zoraCreate = new ZoraCreateDataSource(networkId);
    this.soundXYZ = new SoundXYZDataSource(networkId);
  }

  hasSecondaryData = (_: ContractFetchInfo) => true;

  fetchNFTContract = async (address: string): Promise<NFTContractObject> => {
    const collectionQuery = this.zdk.collection({ address });
    const statQuery = this.zdk.collectionStatsAggregate({
      collectionAddress: address,
      network: { network: Network.Ethereum, chain: Chain.Mainnet },
    });
    const res = await Promise.all([collectionQuery, statQuery]);
    return {
      collection: {
        ...res[0],
        name: res[0].name || undefined,
        symbol: res[0].symbol || undefined,
        totalSupply: res[0].totalSupply || undefined,
      },
      aggregateStat: {
        ...res[1].aggregateStat,
        floorPrice: res[1].aggregateStat.floorPrice || undefined,
      },
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
      let markets = await Promise.allSettled([
        this.soundXYZ.loadEdition(address),
        this.zoraCreate.loadEdition(address),
      ]).then((x) => x.flat());

      const formatted = markets
        .filter((x) => x.status == "fulfilled" && x.value)
        .map((x) => (x as any).value)
        .flat();

      if (formatted.length < 1) return current;

      return {
        ...current,
        markets: formatted,
      };
    } catch (err) {
      console.log("Error fetching edition data", err);
    }

    return current;
  }
}
