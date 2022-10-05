import { NetworkIDs } from "@zoralabs/nft-hooks";
import { ZORA_EDITIONS_BY_NETWORK } from "constants/urls";
import { GraphQLClient } from "graphql-request";
import DataLoader from "dataloader";
import {
  EditionContractLike,
  PrimarySaleModule,
  PRIMARY_SALE_SOURCES,
} from "@artiva/shared";
import { ZORA_EDITIONS_BY_ADDRESSES } from "./queries";
import { compareAddress } from "utils/compareAddress";
import { decode } from "js-base64";

export default class ZoraCreateDataSource {
  client: GraphQLClient;
  dataloader: DataLoader<string, PrimarySaleModule>;
  MAX_SIZE = 50;

  constructor(networkId: NetworkIDs) {
    this.client = new GraphQLClient(ZORA_EDITIONS_BY_NETWORK[networkId]);
    this.dataloader = new DataLoader(this.fetchEditions, {
      maxBatchSize: this.MAX_SIZE,
      batchScheduleFn: (cb: any) => setTimeout(cb, 1300),
    });
  }

  loadEdition = (address: string): Promise<PrimarySaleModule> => {
    return this.dataloader.load(address);
  };

  fetchEditions = async (
    addresses: readonly string[]
  ): Promise<(PrimarySaleModule | Error)[]> => {
    const res = await this.client
      .request(
        ZORA_EDITIONS_BY_ADDRESSES(addresses.map((x) => x.toLowerCase()))
      )
      .then((x) => {
        return x.erc721Drops.map((x: any) => {
          const res: EditionContractLike = { ...x };
          res.source = PRIMARY_SALE_SOURCES.zoraERC721Drop;
          res.contractInfo = JSON.parse(
            decode(x.contractURI.split(",")[1])
          ) && {
            imageURI: x.editionMetadata.imageURI,
            animationURI: x.editionMetadata.animationURI,
          };
          return res;
        });
      });

    return addresses.map(
      (address) =>
        res.find((x: any) => compareAddress(address, x.id)) ||
        new Error("No asset")
    );
  };
}
