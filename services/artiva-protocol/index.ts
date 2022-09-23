import { ethers } from "ethers";
import PlatformABI from "@artiva/v2/dist/artifacts/Platform.sol/Platform.json";
import { AlchemyProvider } from "@ethersproject/providers";
import axios from "axios";
import { defaultPlatform } from "constants/default-platform";

const provider = new AlchemyProvider(
  parseInt(process.env.NEXT_PUBLIC_PLATFORM_NETWORK!),
  process.env.NEXT_PUBLIC_ALCHEMY_KEY!
);

export const ArtivaContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!,
  PlatformABI.abi,
  provider
);

export const getMetadata = async () => {
  const metadataURI = await ArtivaContract.platformMetadataURI();
  if (!metadataURI) return defaultPlatform;
  return await axios.get(metadataURI).then((x) => x.data);
};
