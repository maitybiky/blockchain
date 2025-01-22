import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IBlockchain } from "../blockchain/BlockChain/type";
type Store = {
  myPeerId: string | undefined;
  setOwnPeerId: (peerId: string) => void;
  peerConnections: Record<string, RTCPeerConnection>;
  addConnection: (peerId: string, connection: RTCPeerConnection) => void;
  removeConnection: (peerId: string) => void;

  dataChannels: Record<string, RTCDataChannel>;
  addDataChannel: (peerId: string, channel: RTCDataChannel) => void;
  removeDataChannel: (peerId: string) => void;
  chain: IBlockchain;
  updateChain: (chain: IBlockchain) => void;
};

const networkStore = create<Store>()(
  devtools((set) => ({
    myPeerId: undefined,
    setOwnPeerId: (peerId: string) => set(() => ({ myPeerId: peerId })),
    // Peer connections
    peerConnections: {},

    addConnection: (peerId, connection) => {
      return set((state) => ({
        peerConnections: { ...state.peerConnections, [peerId]: connection },
      }));
    },

    removeConnection: (peerId) =>
      set((state) => {
        const { [peerId]: _, ...updatedConnections } = state.peerConnections;
        return { peerConnections: updatedConnections };
      }),

    // Data channels
    dataChannels: {},

    addDataChannel: (peerId, channel) =>
      set((state) => ({
        dataChannels: { ...state.dataChannels, [peerId]: channel },
      })),

    removeDataChannel: (peerId) =>
      set((state) => {
        const { [peerId]: _, ...updatedChannels } = state.dataChannels;
        return { dataChannels: updatedChannels };
      }),
    updateChain: (chain: IBlockchain) => set(() => ({ chain })),
  }))
);

export default networkStore;
