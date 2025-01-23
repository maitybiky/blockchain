import { getDataChannel } from "../../../../state/getter";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const requestLastBlock = () => {
  const { dataChannels, myPeerId } = networkStore.getState();
  if (Object.entries(dataChannels).length === 0) {
    setTimeout(() => {
      requestLastBlock();
    }, 1000);
    return;
  }

  for (const peerId in dataChannels) {
    console.log("peerId", peerId);
    const dataChannel = getDataChannel(peerId);

    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(
        JSON.stringify({ event: events.LAST_BLOCK_REQUEST, peerId: myPeerId })
      );
    } else {
      console.log(`Data channel with ${peerId} is not open`);
      setTimeout(() => {
        requestLastBlock();
      }, 1000);
    }
  }
};
