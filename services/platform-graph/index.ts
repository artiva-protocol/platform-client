import client from "./client";
import {
  CONTENT_BY_PLATFORM_AND_OWNER,
  CONTENT_BY_PLATFORM,
  USER_ROLES_BY_PLATFORM_AND_USER,
} from "./queries";

export type GetContentByPlatformResponse = {
  uri: string;
  owner: {
    id: string;
  };
  setAtTimestamp: string;
};

export type GetContentByPlatformAndOwnerResponse = {
  uri: string;
  contentId: string;
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

export const getContentByPlatform = async (
  platformAddress: string
): Promise<GetContentByPlatformResponse[]> => {
  const res = await client.request(
    CONTENT_BY_PLATFORM(platformAddress.toLowerCase())
  );
  return res.contents;
};

export const getContentByPlatformAndOwner = async (
  platformAddress: string,
  ownerAddress: string
): Promise<GetContentByPlatformAndOwnerResponse[]> => {
  const res = await client.request(
    CONTENT_BY_PLATFORM_AND_OWNER(
      platformAddress.toLowerCase(),
      ownerAddress.toLowerCase()
    )
  );
  return res.contents;
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
