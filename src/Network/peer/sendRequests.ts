import { getMyPeerId } from "./peer";

export const getChainReq = (dataChannels: Record<string, RTCDataChannel>) => {
  if (Object.entries(dataChannels).length === 0) {
    setTimeout(() => {
      getChainReq(dataChannels);
    }, 1000);
  }
  for (const peerId in dataChannels) {
    console.log("peerId", peerId);
    const dataChannel = dataChannels[peerId];
    if (dataChannel.readyState === "open") {
      dataChannel.send(
        JSON.stringify({ event: "get-chain", peerId: getMyPeerId() })
      );
      console.log(`get chain req`);
    } else {
      console.log(`Data channel with ${peerId} is not open`);
      setTimeout(() => {
        getChainReq(dataChannels);
      }, 1000);
    }
  }
};
