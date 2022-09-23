import { gql } from "graphql-request";

export const ZORA_EDITIONS_BY_ADDRESSES = (addresses: readonly string[]) => {
  return gql`
      {
        erc721Drops(where: { address_in: ${JSON.stringify(addresses)} }) {
            id
            maxSupply
            contractURI
            owner
            totalMinted
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
