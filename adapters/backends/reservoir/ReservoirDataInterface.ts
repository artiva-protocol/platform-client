import { NFTInterface } from "@zoralabs/nft-hooks/dist/types";

export type ReservoirAttribute = {
  key: string;
  value: string;
};

export type ReservoirAsset = {
  contract: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  media?: string;
  kind: string;
  collection: {
    id: string;
    name: string;
    image: string;
    slug: string;
  };
  owner: string;
  attributes: ReservoirAttribute[];
};

export type ReservoirMarket = {
  floorAsk: {
    id: string;
    price: {
      currency: {
        contract: string;
        name: string;
        symbol: string;
        decimals: number;
      };
      amount: {
        raw: string;
        decimal: number;
        usd: number;
        native: number;
      };
    };
    maker: "string";
    validFrom: number;
    validUntil: number;
    source: any;
  };
};

export type ReservoirResponse = {
  token: ReservoirAsset;
  market: ReservoirMarket;
};

export interface ReservoirDataInterface
  extends NFTInterface<ReservoirResponse> {}
