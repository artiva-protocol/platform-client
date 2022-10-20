import { CustomConnectButton } from "@artiva/shared";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const ArtivaConnectButton = ({ className }: { className: string }) => {
  return (
    <ConnectButton.Custom>
      {(props) => <CustomConnectButton {...props} className={className} />}
    </ConnectButton.Custom>
  );
};

export default ArtivaConnectButton;
