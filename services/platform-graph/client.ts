import { GraphQLClient } from "graphql-request";
console.log("subgraph_url", process.env.NEXT_PUBLIC_ARTIVA_SUBGRAPH_URL);
export default new GraphQLClient(process.env.NEXT_PUBLIC_ARTIVA_SUBGRAPH_URL!);
