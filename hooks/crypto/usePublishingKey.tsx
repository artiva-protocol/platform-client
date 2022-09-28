import { useState, useEffect, useMemo, useCallback } from "react";
import { get, set, del } from "idb-keyval";
import { useAccount } from "wagmi";
import { Wallet } from "ethers";
import { RelayProvider } from "@opengsn/provider";
import Web3 from "web3";
import { MyGSNConfig } from "configs/gsn_config";
import { useProvider } from "wagmi";

const usePublishingKey = () => {
  const [instance, setInstance] = useState<Wallet | undefined>();
  const { address } = useAccount();
  const [provider, setProvider] = useState<RelayProvider | undefined>();
  const ethersProvider = useProvider();

  const dbKey = `publishing-private-key-${address}`;

  const _generateAndStoreKey = useCallback(async () => {
    const instance = Wallet.createRandom();
    await set(dbKey, instance.privateKey);
    return instance;
  }, [dbKey]);

  useEffect(() => {
    const handler = async () => {
      try {
        let privateKey = await get(dbKey);
        if (!privateKey) _generateAndStoreKey();

        const provider = await RelayProvider.newProvider({
          provider: Web3.givenProvider,
          config: MyGSNConfig,
        }).init();

        provider.addAccount(privateKey);
        setInstance(new Wallet(privateKey, ethersProvider));
        setProvider(provider);
      } catch (err) {
        console.log("Error generating publishing key", err);
      }
    };

    handler();
  }, [dbKey, _generateAndStoreKey]);

  const publicKey = useMemo(() => {
    if (!instance) return;
    return instance.address;
  }, [instance]);

  const clearPrivateKey = async () => {
    await del(dbKey);
    const newInstance = await _generateAndStoreKey();
    setInstance(newInstance);
  };

  return { instance, publicKey, clearPrivateKey, provider };
};

export default usePublishingKey;
