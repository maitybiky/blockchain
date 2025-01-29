import { ITransaction } from "../../../../blockchain/Transaction/type";
import { getDataChannel } from "../../../../state/getter";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const broadcastTransaction = (transaction: ITransaction) => {
  const { dataChannels, myPeerId } = networkStore.getState();
  if (Object.entries(dataChannels).length === 0) {
    setTimeout(() => {
      broadcastTransaction(transaction);
    }, 1000);
    return;
  }

  for (const peerId in dataChannels) {
    console.log("peerId", peerId);
    const dataChannel = getDataChannel(peerId);

    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(
        JSON.stringify({
          event: events.TRANSACTION_BROADCAST,
          peerId: myPeerId,
          transaction,
        })
      );
      console.log(`get chain req`);
    } else {
      console.log(`Data channel with ${peerId} is not open`);
      setTimeout(() => {
        broadcastTransaction(transaction);
      }, 1000);
    }
  }
};
