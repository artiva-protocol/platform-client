import { GSNConfig } from "@opengsn/provider";

export const MyGSNConfig: Partial<GSNConfig> = {
  paymasterAddress: process.env.NEXT_PUBLIC_PAYMASTER_ADDRESS,
  minMaxPriorityFeePerGas: 4100000000,
};
