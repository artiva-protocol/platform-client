import { Platform } from "@artiva/shared";
import { defaultPlatform } from "constants/default-platform";
import client from "./client";
import {
  POSTS_BY_PLATFORM_AND_OWNER,
  POSTS_BY_PLATFORM,
  USER_ROLES_BY_PLATFORM_AND_USER,
  PLATFORM_METADATA_BY_PLATFORM,
} from "./queries";

export type GetPostsResponse = {
  id: string;
  contentJSON: string;
  type: string;
  owner: {
    id: string;
  };
  setAtTimestamp: string;
};

export type GetRolesByPlatformAndOwnerResponse = {
  admin: boolean;
  metadataManager: boolean;
  contentPublisher: boolean;
};

export const getPostsByPlatform = async (
  platformAddress: string
): Promise<GetPostsResponse[]> => {
  const res = await client.request(
    POSTS_BY_PLATFORM(platformAddress.toLowerCase())
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

export const getPlatformMetadataByPlatform = async (
  platformAddress: string
): Promise<Platform> => {
  const res = await client.request(
    PLATFORM_METADATA_BY_PLATFORM(platformAddress)
  );
  return res.platform?.metadataJSON
    ? JSON.parse(res.platform.metadataJSON)
    : defaultPlatform;
};
