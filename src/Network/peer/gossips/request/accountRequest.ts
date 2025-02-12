import { getDataChannel } from "../../../../state/getter";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const getAccountReq = (dataChannels: Record<string, RTCDataChannel>) => {
  const { myPeerId } = networkStore.getState();
  console.log("dataChannels :>> ", dataChannels);
  for (const peerId in dataChannels) {
    if (peerId === myPeerId) continue;

    const dataChannel = getDataChannel(peerId);

    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(
        JSON.stringify({ event: events.GET_ACCOUNT, peerId: myPeerId })
      );
      console.log(`requesting account`);
    } else {
      console.log(`Data channel with ${peerId} is not open`);
      // setTimeout(() => {
      //   getChainReq();
      // }, 1000);
    }
  }
};
