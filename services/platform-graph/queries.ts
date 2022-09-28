import { gql } from "graphql-request";

export const POSTS_BY_PLATFORM = (platformAddress: string) => {
  return gql`
    {
      posts(where: { platform: "${platformAddress}" }, orderBy: setAtTimestamp, orderDirection: desc) {
        id
        contentJSON
        type
        owner {
            id
        }
        setAtTimestamp
      }
    }
    `;
};

export const POSTS_BY_PLATFORM_AND_OWNER = (
  platformAddress: string,
  ownerAddress: string
) => {
  return gql`
      {
        posts(where: { platform: "${platformAddress}", owner: "${platformAddress}:${ownerAddress}" }, orderBy: setAtTimestamp, orderDirection: desc) {
          id
          contentJSON
          type
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

export const PLATFORM_METADATA_BY_PLATFORM = (platformAddress: string) => {
  return gql`
    {
      platform(id: "${platformAddress}") {
        metadataJSON
      }
    }
  `;
};
