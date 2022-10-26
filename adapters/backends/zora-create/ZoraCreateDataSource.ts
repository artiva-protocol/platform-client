import { NetworkIDs } from "@zoralabs/nft-hooks";
import { ZORA_EDITIONS_BY_NETWORK } from "constants/urls";
import { GraphQLClient } from "graphql-request";
import DataLoader from "dataloader";
import {
  PrimarySaleModule,
  PRIMARY_SALE_SOURCES,
  PRIMARY_SALE_TYPES,
} from "@artiva/shared";
import {
  ZoraEdition,
  ZoraEditionsResponse,
  ZORA_EDITIONS_BY_ADDRESSES,
} from "./queries";
import { compareAddress } from "utils/compareAddress";
import { MARKET_INFO_STATUSES } from "@zoralabs/nft-hooks/dist/types";
import { BigNumber } from "ethers";

export default class ZoraCreateDataSource {
  client: GraphQLClient;
  dataloader: DataLoader<string, PrimarySaleModule[]>;
  MAX_SIZE = 50;

  constructor(networkId: NetworkIDs) {
    this.client = new GraphQLClient(ZORA_EDITIONS_BY_NETWORK[networkId]);
    this.dataloader = new DataLoader(this.fetchEditions, {
      maxBatchSize: this.MAX_SIZE,
    });
  }

  loadEdition = (address: string): Promise<PrimarySaleModule[]> => {
    return this.dataloader.load(address);
  };

  transformEdition = (edition: ZoraEdition): PrimarySaleModule[] => {
    const base = {
      contractAddress: edition.address,
      source: PRIMARY_SALE_SOURCES.zoraERC721Drop,
      status: MARKET_INFO_STATUSES.ACTIVE,
      maxSupply: edition.maxSupply,
      price: edition.salesConfig.publicSalePrice,
      media: {
        image: {
          uri: edition.editionMetadata.imageURI,
        },
        content: {
          uri: edition.editionMetadata.animationURI,
        },
      },
      raw: edition,
    };

    return [
      {
        ...base,
        type: PRIMARY_SALE_TYPES.PresaleEdition,
        startTime: edition.salesConfig.presaleStart,
        endTime: edition.salesConfig.presaleEnd,
      },
      {
        ...base,
        type: PRIMARY_SALE_TYPES.PublicEdition,
        startTime: edition.salesConfig.publicSaleStart,
        endTime: edition.salesConfig.publicSaleEnd,
      },
    ];
  };

  fetchEditions = async (
    addresses: readonly string[]
  ): Promise<(PrimarySaleModule[] | Error)[]> => {
    const res = await this.client
      .request(
        ZORA_EDITIONS_BY_ADDRESSES(addresses.map((x) => x.toLowerCase()))
      )
      .then((x: ZoraEditionsResponse) =>
        x.erc721Drops.flatMap((x: ZoraEdition) => this.transformEdition(x))
      );

    if (res.length < 1) throw new Error("No editions found");

    return addresses.map(
      (address) =>
        res
          .filter((x) => compareAddress(address, x.contractAddress))
          .sort((a, b) =>
            BigNumber.from(b.endTime).sub(BigNumber.from(a.endTime)).toNumber()
          ) || new Error("No asset")
    );
  };
}
