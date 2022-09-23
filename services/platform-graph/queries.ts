import { gql } from "graphql-request";

export const CONTENT_BY_PLATFORM = (platformAddress: string) => {
  return gql`
    {
        contents(where: { platform: "${platformAddress}" }, orderBy: setAtTimestamp, orderDirection: desc) {
            uri
            owner {
                id
            }
            setAtTimestamp
        }
    }
    `;
};

export const CONTENT_BY_PLATFORM_AND_OWNER = (
  platformAddress: string,
  ownerAddress: string
) => {
  return gql`
      {
          contents(where: { platform: "${platformAddress}", owner: "${platformAddress}:${ownerAddress}" }, orderBy: setAtTimestamp, orderDirection: desc) {
            uri
            contentId
            owner {
                id
            }   
            setAtTimestamp
          }
      }
      `;
};

export const USER_ROLES_BY_PLATFORM_AND_USER = (
  platformAddress: string,
  userAddress: string
) => {
  return gql`
    {
      platformUsers(where:{ platform: "${platformAddress}", user: "${userAddress}" }) {
        admin,
        contentPublisher,
        metadataManager,
      }
    }
  `;
};
