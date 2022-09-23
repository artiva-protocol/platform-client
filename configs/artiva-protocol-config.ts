export const ArtivaProtocolTypedDataConfig = {
  domain: {
    version: "1",
    chainId: process.env.NEXT_PUBLIC_PLATFORM_NETWORK,
    verifyingContract: process.env.NEXT_PUBLIC_PLATFORM_ADDRESS!,
  },
  types: {
    PublishAuthorization: [
      { name: "message", type: "string" },
      { name: "publishingKey", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
  },
};
