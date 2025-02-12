import Account from "../../../../AccountModel";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const sendAccountState = (peerId: string) => {
  const { dataChannels, myPeerId } = networkStore.getState();
  if (myPeerId === peerId) return;


  const payload = {
    event: events.ACCOUNT_SEND,
    account: Account.getTheAccount().getAllWalletBalance(),
  };
  console.log("sending account to new joinee", peerId,payload);
console.log('dataChannels[peerId] :>> ', dataChannels[peerId]);
  dataChannels[peerId].send(JSON.stringify(payload));
};
