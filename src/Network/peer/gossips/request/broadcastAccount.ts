import { AccountSet } from "../../../../AccountModel/type";
import { getDataChannel } from "../../../../state/getter";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const broadcastAccount = (account: AccountSet) => {
  const { dataChannels, myPeerId } = networkStore.getState();
  // if (Object.entries(dataChannels).length === 0) {
  //   setTimeout(() => {
  //     broadcastTransaction(transaction);
  //   }, 1000);
  //   return;
  // }

  for (const peerId in dataChannels) {
    console.log("peerId", peerId);
    const dataChannel = getDataChannel(peerId);

    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(
        JSON.stringify({
          event: events.ACCOUNT_BROADCAST,
          peerId: myPeerId,
          account,
        })
      );
    } else {
      console.log(`Data channel with ${peerId} is not open`);
      // setTimeout(() => {
      //   broadcastAccount(account);
      // }, 1000);
    }
  }
};
