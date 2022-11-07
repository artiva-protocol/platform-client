import { ChainIdentifier } from "@artiva/shared";
import { Provider } from "@ethersproject/providers";
import { NFTObject } from "@zoralabs/nft-hooks";
import {
  FIXED_PRICE_MARKET_SOURCES,
  MARKET_INFO_STATUSES,
} from "@zoralabs/nft-hooks/dist/types";
import { RESERVOIR_API_BY_NETWORK } from "constants/urls";
import { Signer, BigNumberish, ContractTransaction } from "ethers";
import IMarketAdapter from "../IMarketAdapter";
import { createClient, getClient } from "@reservoir0x/reservoir-kit-client";

export class ReserviorMarketAdapter implements IMarketAdapter {
  signerOrProvider?: Signer | Provider;

  connect(signerOrProvider: Signer | Provider, chain: ChainIdentifier): void {
    createClient({
      apiBase: RESERVOIR_API_BY_NETWORK[1],
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
      source: "artiva.us",
    });
    this.signerOrProvider = signerOrProvider;
  }

  placeBid(nft: NFTObject, amount: BigNumberish): Promise<ContractTransaction> {
    throw new Error("Method not implemented.");
  }

  async fillAsk(nft: NFTObject, _: BigNumberish): Promise<boolean> {
    if (!this.signerOrProvider || !("getAddress" in this.signerOrProvider))
      throw new Error("Not connected");

    const client = getClient();

    try {
      return await client?.actions.buyToken({
        tokens: [
          {
            tokenId: nft.nft?.tokenId!,
            contract: nft.nft?.contract.address!,
          },
        ],
        signer: this.signerOrProvider,
        onProgress: () => {
          //Do nothing
        },
      });
    } catch (err: any) {
      const message: string | undefined = err?.response?.data?.message;
      throw message ? new Error(message) : err;
    }
  }

  offer(nft: NFTObject): Promise<ContractTransaction> {
    throw new Error("Method not implemented.");
  }

  enabled(nft: NFTObject): boolean {
    return !!nft.markets?.find(
      (x) =>
        x.source === FIXED_PRICE_MARKET_SOURCES.OPENSEA_FIXED &&
        x.status === MARKET_INFO_STATUSES.ACTIVE
    );
  }
}

export default new ReserviorMarketAdapter();
