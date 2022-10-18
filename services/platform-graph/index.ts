import { Platform, Post } from "@artiva/shared";
import client from "./client";
import {
  POSTS_BY_PLATFORM_AND_OWNER,
  POSTS_BY_PLATFORM,
  USER_ROLES_BY_PLATFORM_AND_USER,
  PLATFORM_METADATA_BY_PLATFORM,
  POSTS_BY_PLATFORM_AND_TAG,
  POSTS_BY_PLATFORM_AND_FEATURED,
  POST_BY_PLATFORM_AND_ID,
  PLATFORMS_BY_USER,
} from "./queries";

export type GetPostsResponse = {
  id: string;
  contentJSON: string;
  type: string;
  owner: {
    id: string;
  };
  tags: { name: string }[];
  setAtTimestamp: string;
};

export type GetRolesByPlatformAndOwnerResponse = {
  admin: boolean;
  metadataManager: boolean;
  contentPublisher: boolean;
};

export type GetPlatformsResponse = Platform & { contract: string };

//PLATFORMS

export const getPlatformsByUser = async (
  userAddress: string
): Promise<GetPlatformsResponse[]> => {
  const res = await client.request(
    PLATFORMS_BY_USER(userAddress.toLowerCase())
  );
  return res.platforms.map((x: { id: string; metadataJSON: string }) => ({
    ...JSON.parse(x.metadataJSON || "{}"),
    contract: x.id,
  }));
};

//POSTS

export const getPostsByPlatform = async (
  platformAddress: string
): Promise<GetPostsResponse[]> => {
  const res = await client.request(
    POSTS_BY_PLATFORM(platformAddress.toLowerCase())
  );
  return res.posts;
};

export const getPostByPlatformAndId = async (
  platformAddress: string,
  postId: string
): Promise<Post> => {
  const res = await client.request(
    POST_BY_PLATFORM_AND_ID(platformAddress.toLowerCase(), postId)
  );

  const rawPost = res.post;
  const formattedPost = {
    id: rawPost.id,
    content: JSON.parse(rawPost.contentJSON),
    type: rawPost.type,
    tags: rawPost.tags.map((tag: any) => tag.name),
  } as Post;

  return formattedPost;
};

export const getPostsByPlatformAndFeatured = async (
  platformAddress: string
): Promise<GetPostsResponse[]> => {
  const res = await client.request(
    POSTS_BY_PLATFORM_AND_FEATURED(platformAddress.toLowerCase())
  );
  return [...res.featured, ...res.posts];
};

export const getPostsByPlatformAndTag = async (
  platformAddress: string,
  tag: string
): Promise<GetPostsResponse[]> => {
  const res = await client.request(
    POSTS_BY_PLATFORM_AND_TAG(platformAddress.toLowerCase(), tag)
  );
  return res.posts;
};

export const getPostsByPlatformAndOwner = async (
  platformAddress: string,
  ownerAddress: string
): Promise<GetPostsResponse[]> => {
  const res = await client.request(
    POSTS_BY_PLATFORM_AND_OWNER(
      platformAddress.toLowerCase(),
      ownerAddress.toLowerCase()
    )
  );
  return res.posts;
};

//USERS

export const getUserRolesByPlatformAndUser = async (
  platformAddress: string,
  userAddress: string
): Promise<GetRolesByPlatformAndOwnerResponse> => {
  const res = await client.request(
    USER_ROLES_BY_PLATFORM_AND_USER(
      platformAddress.toLowerCase(),
      userAddress.toLowerCase()
    )
  );
  return res.platformUsers[0];
};

//METADATA

export const getPlatformMetadataByPlatform = async (
  platformAddress: string
): Promise<Platform | undefined> => {
  const res = await client.request(
    PLATFORM_METADATA_BY_PLATFORM(platformAddress.toLowerCase())
  );

  return res.platform?.metadataJSON
    ? JSON.parse(res.platform.metadataJSON)
    : undefined;
};
