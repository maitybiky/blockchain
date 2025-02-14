import Blockchain from "../../../../blockchain/BlockChain";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

// when new node join and request you the chain
export function sendChain(peerId: string) {
  const { dataChannels } = networkStore.getState();

  if (Object.entries(dataChannels).length === 0) {
    console.log("empty channels");
    setTimeout(() => {
      sendChain(peerId);
    }, 1000);
  } else {
    const payload = {
      event: events.CHAIN_BROAD_CAST,
      data: Blockchain.getBlockChain(),
    };
console.log('dataChannels[peerId] :>> ', dataChannels[peerId]);
    dataChannels[peerId].send(JSON.stringify(payload));
  }
}
