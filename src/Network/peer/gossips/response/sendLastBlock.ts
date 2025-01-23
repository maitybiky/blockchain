import Blockchain from "../../../../blockchain/BlockChain";
import networkStore from "../../../../state/networkstore";
import { events } from "../events";

export function sendLastBlock(peerId: string) {
  const { dataChannels } = networkStore.getState();
  const chain = Blockchain.getBlockChain();

  if (Object.entries(dataChannels).length === 0) {
    setTimeout(() => {
      sendLastBlock(peerId);
    }, 1000);
  } else {
    const payload = {
      event: events.LAST_BLOCK_SEND,
      data: chain.getLatestBlock(),
    };

    dataChannels[peerId].send(JSON.stringify(payload));
  }
}
