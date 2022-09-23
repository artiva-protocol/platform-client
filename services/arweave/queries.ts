import { gql } from "graphql-request";

export const TRANSACTIONS = () => {
  return gql`
    query getTransactions($tags: [TagFilter!]) {
      transactions(tags: $tags, sort: HEIGHT_DESC) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;
};
