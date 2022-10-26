ZoraCreateSaleAdapter;
import type IPrimarySaleAdapter from "./IPrimarySaleAdapter";
import ZoraCreateSaleAdapter from "./ZoraCreate/ZoraCreateSaleAdapter";
import SoundXYZSaleAdapter from "./sound-xyz/SoundXYZSaleAdapter";

export const DefaultPrimarySaleAdapters = [
  ZoraCreateSaleAdapter,
  SoundXYZSaleAdapter,
];
export type { IPrimarySaleAdapter };
