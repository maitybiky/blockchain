import networkStore from "./networkstore";

export const getConnection = (
  peerId: string
): RTCPeerConnection | undefined => {
  return networkStore.getState().peerConnections[peerId];
};
export const getDataChannel = (peerId: string): RTCDataChannel | undefined => {
  return networkStore.getState().dataChannels[peerId];
};
