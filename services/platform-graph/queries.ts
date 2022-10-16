import { gql } from "graphql-request";

//PLATFORMS

export const PLATFORMS_ORDERED_BY_DEPLOYMENT = () => {
  return gql`
    {
      platforms(orderBy: deployedAtTimestamp, orderDirection: desc) {
        id
      }
    }
  `;
};

//POSTS

export const POSTS_BY_PLATFORM = (platformAddress: string) => {
  return gql`
    {
      posts(where: { platform: "${platformAddress}" }, orderBy: order, orderDirection: desc) {
        id: contentId
        contentJSON
        type
        tags {
          name
        }
        owner {
            id
        }
        setAtTimestamp
      }
    }
    `;
};

export const POST_BY_PLATFORM_AND_ID = (
  platformAddress: string,
  postId: string
) => {
  return gql`
    {
      post(id: "${platformAddress}:${postId}") {
        id: contentId
        contentJSON
        type
        tags {
          name
        }
        owner {
            id
        }
        setAtTimestamp
      }
    }
    `;
};

export const POSTS_BY_PLATFORM_AND_FEATURED = (platformAddress: string) => {
  return gql`
  {
    featured: posts(where: { platform: "${platformAddress}", tags_contains: ["${platformAddress}:Featured"] }, orderBy: order, orderDirection: desc) {
      id: contentId
      contentJSON
      type
      tags {
        name
      }
      owner {
          id
      }   
      setAtTimestamp
    }
    posts(where: { platform: "${platformAddress}", tags_not_contains: ["${platformAddress}:Featured"] }, orderBy: order, orderDirection: desc) {
      id: contentId
      contentJSON
      type
      tags {
        name
      }
      owner {
          id
      }
      setAtTimestamp
    }
  }
  `;
};

export const POSTS_BY_PLATFORM_AND_TAG = (
  platformAddress: string,
  tag: string
) => {
  return gql`
  {
    posts(where: { platform: "${platformAddress}", tags_contains: ["${platformAddress}:${tag}"] }, orderBy: order, orderDirection: desc) {
      id: contentId
      contentJSON
      type
      tags {
        name
      }
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
        posts(where: { platform: "${platformAddress}", owner: "${platformAddress}:${ownerAddress}" }, orderBy: order, orderDirection: desc) {
          id: contentId
          contentJSON
          type
          tags {
            name
          }
          owner {
              id
          }   
          setAtTimestamp
        }
      }
      `;
};

//ROLES

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

//METADATA

export const PLATFORM_METADATA_BY_PLATFORM = (platformAddress: string) => {
  return gql`
    {
      platform(id: "${platformAddress}") {
        metadataJSON
      }
    }
  `;
};
