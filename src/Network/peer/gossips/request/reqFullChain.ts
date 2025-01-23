import { getDataChannel } from "../../../../state/getter";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export const getChainReq = () => {
    const { dataChannels, myPeerId } = networkStore.getState();
    if (Object.entries(dataChannels).length === 0) {
      setTimeout(() => {
        getChainReq();
      }, 1000);
      return;
    }
  
    for (const peerId in dataChannels) {
      console.log("peerId", peerId);
      const dataChannel = getDataChannel(peerId);
  
      if (dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(
          JSON.stringify({ event: events.GET_CHAIN, peerId: myPeerId })
        );
        console.log(`get chain req`);
      } else {
        console.log(`Data channel with ${peerId} is not open`);
        setTimeout(() => {
          getChainReq();
        }, 1000);
      }
    }
  };