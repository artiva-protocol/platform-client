import { RoleEnum } from "@/hooks/platform/useCreatePlatform";
import { Platform, Post } from "@artiva/shared";
import client from "./client";
import {
  USER_ROLES_BY_USER,
  PLATFORM_METADATA_BY_PLATFORM,
  POST_BY_PLATFORM_AND_ID,
  PLATFORMS_BY_USER,
  PLATFORMS_BY_USER_AFTER_TIMESTAMP,
  POSTS_BY_PLATFORM,
  USERS_BY_PLATFORM_WITH_ROLE,
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

export type GetPlatformUserResponse = {
  user: string;
  role: string;
};

export type GetPlatformsResponse = Platform & { contract: string };

export type UserRolesResponse = {
  user: string;
  roles: {
    [platform: string]: RoleEnum;
  };
};

//PLATFORMS

export const getPlatformsByUserAfterTimeStamp = async (
  userAddress: string,
  timestamp: string
): Promise<string | undefined> => {
  const res = await client.request(
    PLATFORMS_BY_USER_AFTER_TIMESTAMP(userAddress.toLowerCase(), timestamp)
  );
  return res.platforms.length > 0 ? res.platforms[0].id : undefined;
};

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

export const getPostByPlatformAndId = async (
  platformAddress: string,
  postId: string
): Promise<Post | undefined> => {
  const res = await client.request(
    POST_BY_PLATFORM_AND_ID(platformAddress.toLowerCase(), postId)
  );

  const rawPost = res.post;

  if (!rawPost) return;
  const formattedPost = {
    id: rawPost.id,
    content: JSON.parse(rawPost.contentJSON),
    type: rawPost.type,
    tags: rawPost.tags.map((tag: any) => tag.name),
  } as Post;

  return formattedPost;
};

export const getPostsByPlatform = async (
  platformAddress: string,
  ownerAddress?: string,
  tag?: string,
  limit?: number,
  page?: number
): Promise<GetPostsResponse[]> => {
  const res = await client.request(
    POSTS_BY_PLATFORM(
      platformAddress.toLowerCase(),
      ownerAddress?.toLowerCase(),
      tag,
      limit,
      page
    )
  );
  return res.posts;
};

//USERS

const formatRole = (role: string): RoleEnum => {
  switch (role) {
    case "PUBLISHER":
      return RoleEnum.PUBLISHER;
    case "MANAGER":
      return RoleEnum.MANAGER;
    case "ADMIN":
      return RoleEnum.ADMIN;
    default:
      return RoleEnum.UNAUTHORIZED;
  }
};

export const getUserRolesByUser = async (
  userAddress: string
): Promise<UserRolesResponse> =>
  client
    .request(USER_ROLES_BY_USER(userAddress.toLowerCase()))
    .then((x: { platformUsers: any[] }) => {
      let roleResponse: UserRolesResponse = { user: userAddress, roles: {} };
      x.platformUsers.map((y: any) => {
        roleResponse.roles[y.platform.id as string] = formatRole(y.role);
      });
      return roleResponse;
    });

export const getUsersByPlatformWithRole = async (
  platformAddress: string
): Promise<GetPlatformUserResponse[]> =>
  client
    .request(USERS_BY_PLATFORM_WITH_ROLE(platformAddress.toLowerCase()))
    .then((x) => x.platformUsers);

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
