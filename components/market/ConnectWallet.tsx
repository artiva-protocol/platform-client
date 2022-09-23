import CustomConnectButton from "../CustomConnectButton";

const ConnectWallet = () => {
  return (
    <div className="text-center">
      <div className="text-4xl font-semibold">Connect your wallet</div>
      <div className="text-lg mt-2 text-gray-500 font-light">
        Please connect your wallet to continue with the transaction
      </div>
      <CustomConnectButton className="w-full h-12 bg-black text-white text-lg mt-6 rounded-md" />
    </div>
  );
};

export default ConnectWallet;
