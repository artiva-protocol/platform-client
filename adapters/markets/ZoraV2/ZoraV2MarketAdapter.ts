import { NFTObject } from "@zoralabs/nft-hooks";
import {
  AUCTION_SOURCE_TYPES,
  MARKET_INFO_STATUSES,
} from "@zoralabs/nft-hooks/dist/types";
import IMarketAdapter from "../IMarketAdapter";
import { Signer, BigNumberish, ContractTransaction } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ChainIdentifier } from "@artiva/shared";
import { AuctionHouse } from "./AuctionHouse";
import { EVM_CHAIN_IDENTIFIER_TO_CHAINID } from "../../../constants/EVMChainIDLookup";

export class ZoraV2MarketAdapter implements IMarketAdapter {
  auctionHouse?: AuctionHouse;

  connect(signerOrProvider: Signer | Provider, chain: ChainIdentifier) {
    this.auctionHouse = new AuctionHouse(
      signerOrProvider,
      parseInt(EVM_CHAIN_IDENTIFIER_TO_CHAINID[chain])
    );
  }

  placeBid(nft: NFTObject, amount: BigNumberish): Promise<ContractTransaction> {
    if (!this.auctionHouse) throw new Error("Not initilized");
    const auction = this.findAuction(nft);
    if (!auction) throw new Error("No auction found");

    const auctionId = auction.raw?.properties?.auctionId;
    return this.auctionHouse.createBid(auctionId, amount);
  }

  fillAsk(): Promise<ContractTransaction> {
    throw new Error("Method not implemented.");
  }

  offer(): Promise<ContractTransaction> {
    throw new Error("Method not implemented.");
  }

  enabled(nft: NFTObject): boolean {
    return !!this.findAuction(nft);
  }

  private findAuction(nft: NFTObject) {
    return nft.markets?.find(
      (x) =>
        x.source === AUCTION_SOURCE_TYPES.ZORA_RESERVE_V2 &&
        x.status === MARKET_INFO_STATUSES.ACTIVE
    );
  }
}

export default new ZoraV2MarketAdapter();
