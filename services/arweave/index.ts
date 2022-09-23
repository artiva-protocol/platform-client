import arweaveClient from "./arweave-client";
import gqlClient from "./gql-client";
import { TRANSACTIONS } from "./queries";

export type ArweaveTags = { name: string; values: any[] | any }[];

export const queryTransactions = async (
  tags: ArweaveTags
): Promise<string[]> => {
  const res = await gqlClient.request(TRANSACTIONS(), { tags });
  if (!res.transactions.edges) return [];
  return res.transactions.edges.map((x: any) => x.node.id);
};

export const getContentFromTx = async (txId: string): Promise<any> => {
  return arweaveClient.transactions.getData(txId, { decode: true });
};

export const getContentFromTags = async (tags: ArweaveTags): Promise<any[]> => {
  const txids = await queryTransactions(tags);

  let group: Promise<string | Uint8Array>[] = [];
  txids.map((x) => {
    group.push(arweaveClient.transactions.getData(x, { decode: true }));
  });

  return await Promise.all(group);
};
