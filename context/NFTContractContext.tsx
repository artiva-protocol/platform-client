import { useNFTContract } from "@artiva/shared";
import { useState } from "react";
import { createContainer } from "unstated-next";

const useNFTContractContext = () => {
  const [address, setAddress] = useState<string | undefined>();
  const { data } = useNFTContract({
    contractAddress: address,
    chain: "ETHEREUM",
  });

  return { data, setAddress };
};

export default createContainer(useNFTContractContext);
