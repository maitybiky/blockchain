import Wallet from "../blockchain/Wallet";
import { IWallet } from "../blockchain/Wallet/type";
import networkStore from "./networkstore";
import walletStore from "./wallet";

export const getConnection = (
  peerId: string
): RTCPeerConnection | undefined => {
  return networkStore.getState().peerConnections[peerId];
};
export const getDataChannel = (peerId: string): RTCDataChannel | undefined => {
  return networkStore.getState().dataChannels[peerId];
};

export const getWallets = (): IWallet[] => {
  console.log(
    "walletStore.getState().myWallets :>> ",
    walletStore.getState().myWallets
  );
  const wallets = walletStore.getState().myWallets;

  const walletInstances = Object.entries(wallets).map(
    ([key, value]): IWallet => {
      const walletInstance = new Wallet(key);
      walletInstance.serializeWallet(value);
      return walletInstance;
    }
  );
  console.log("walletInstances :>> ", walletInstances);
  return walletInstances;
};
