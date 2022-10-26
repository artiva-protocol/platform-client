import { NFTQuery } from "@zoralabs/nft-hooks/dist/types/NFTQuery";
import { ReservoirDataInterface } from "../backends/reservoir/ReservoirDataInterface";
import { ReservoirDataSource } from "../backends/reservoir/ReservoirDataSource";
import { NetworkIDs } from "@zoralabs/nft-hooks/dist/constants/networks";
import { NFTStrategy } from "@zoralabs/nft-hooks/dist/strategies";

export class ReservoirStrategy extends NFTStrategy {
  reservoirBackend: ReservoirDataInterface;
  constructor(networkId: NetworkIDs) {
    super(networkId);
    this.reservoirBackend = new ReservoirDataSource(
      networkId,
      process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
    );
  }

  fetchNFT = async (contract: string, id: string) => {
    try {
      const nft = await this.reservoirBackend.loadNFT({ contract, id });
      if (nft instanceof Error) {
        throw nft;
      }
      const asset = this.reservoirBackend.transformNFT(nft);
      return asset;
    } catch (err) {
      console.log("Error fetching", err);
      throw err;
    }
  };

  hasSecondaryData = () => false;

  queryNFTs = async (query: NFTQuery) => {
    return await this.reservoirBackend.queryNFTs(query);
  };
}
