import { gql } from "graphql-request";

export type ZoraEditionsResponse = {
  erc721Drops: ZoraEdition[];
};

export type ZoraEdition = {
  id: string;
  maxSupply: number;
  contractURI: string;
  owner: string;
  totalMinted: number;
  address: string;
  editionMetadata: {
    imageURI: string;
    animationURI: string;
  };
  salesConfig: {
    presaleStart: string;
    presaleEnd: string;
    publicSaleStart: string;
    publicSaleEnd: string;
    publicSalePrice: string;
  };
};

export const ZORA_EDITIONS_BY_ADDRESSES = (addresses: readonly string[]) => {
  return gql`
      {
        erc721Drops(where: { address_in: ${JSON.stringify(addresses)} }) {
            id
            maxSupply
            contractURI
            owner
            totalMinted
            address
            editionMetadata {
              imageURI
              animationURI
            }
            salesConfig {
                presaleStart
                presaleEnd
                publicSaleStart
                publicSaleEnd
                publicSalePrice
            }
          }
      }
      `;
};
