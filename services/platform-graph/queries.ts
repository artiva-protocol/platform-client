import { gql } from "graphql-request";

//PLATFORMS

export const PLATFORMS_BY_USER_AFTER_TIMESTAMP = (
  user: string,
  timestamp: string
) => {
  return gql`
    {
      platforms(
        where: {
          deployedAtTimestamp_gt: "${timestamp}"
          users_: { user: "${user}" }
        }
      ) {
        id
      }
    }
  `;
};

export const PLATFORMS_ORDERED_BY_DEPLOYMENT = () => {
  return gql`
    {
      platforms(orderBy: deployedAtTimestamp, orderDirection: desc) {
        id
      }
    }
  `;
};

export const PLATFORMS_BY_USER = (user: string) => {
  return gql`
    {
      platforms(where: { users_: { user: "${user}" }} orderBy: deployedAtTimestamp, orderDirection: desc) {
        id
        metadataJSON
      }
    }
  `;
};

//POSTS

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

export const POSTS_BY_PLATFORM = (
  platformAddress: string,
  ownerAddress?: string,
  tag?: string,
  limit: number = 20,
  page: number = 0
) => {
  const platformQuery = platformAddress
    ? `platform: "${platformAddress}"`
    : undefined;

  const ownerQuery = ownerAddress
    ? `owner: "${platformAddress}:${ownerAddress}"`
    : undefined;

  const tagQuery = tag
    ? `tags_contains: ["${platformAddress}:${tag}"]`
    : undefined;

  const whereString = [platformQuery, ownerQuery, tagQuery].join(", ");

  return gql`
      {
        posts(first: ${limit}, skip: ${
    limit * page
  }, where: { ${whereString} }, orderBy: order, orderDirection: desc) {
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

//USERS

export const USER_ROLES_BY_USER = (userAddress: string) => {
  return gql`
    {
      platformUsers(where:{ user: "${userAddress}" }) {
        user
        role
        platform {
          id
        }
      }
    }
  `;
};

export const USERS_BY_PLATFORM_WITH_ROLE = (platformAddress: string) => {
  return gql`
  {
    platformUsers(where:{ platform: "${platformAddress}", role_not: UNAUTHORIZED }) {
      user
      role
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
