import { getDataChannel } from "../../../../state/getter";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const getChainReq = (dataChannels: Record<string, RTCDataChannel>) => {
  const { myPeerId } = networkStore.getState();

  for (const peerId in dataChannels) {
    if (peerId === myPeerId) continue;
    const dataChannel = getDataChannel(peerId);

    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(
        JSON.stringify({ event: events.GET_CHAIN, peerId: myPeerId })
      );
      console.log(`get chain req`);
    } else {
      console.log(`Data channel with ${peerId} is not open`);
      // setTimeout(() => {
      //   getChainReq();
      // }, 1000);
    }
  }
};
