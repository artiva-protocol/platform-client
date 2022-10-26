import ZoraV2MarketAdapter from "./ZoraV2/ZoraV2MarketAdapter";
import ZoraV3MarketAdapter from "./ZoraV3/ZoraV3MarketAdapter";
import ReserviorMarketAdapter from "./reservior/ReserviorMarketAdapter";
import type IMarketAdapter from "./IMarketAdapter";

export const DefaultMarketAdapters = [
  ZoraV2MarketAdapter,
  ZoraV3MarketAdapter,
  ReserviorMarketAdapter,
];
export type { IMarketAdapter };
