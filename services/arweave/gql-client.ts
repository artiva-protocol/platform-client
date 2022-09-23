import { GraphQLClient } from "graphql-request";
import { ARWEAVE_GRAPHQL_URL } from "constants/urls";

export default new GraphQLClient(ARWEAVE_GRAPHQL_URL);
