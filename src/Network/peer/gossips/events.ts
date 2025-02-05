import Blockchain from "../../../blockchain/BlockChain";
import { onAccountRecieve } from "./response/onAccountRec";
import { addToMemPool } from "./response/onTransactionRec";
import { sendChain } from "./response/sendFullChain";
import { sendLastBlock } from "./response/sendLastBlock";
export const events = {
  CHAIN_BROAD_CAST: "chain-broadcast",
  GET_CHAIN: "get-chain",
  CHAIN_SENDING: "send-chain",
  LAST_BLOCK_REQUEST: "last-block-request",
  LAST_BLOCK_SEND: "send-last-block",
  TRANSACTION_BROADCAST: "broadcast-transaction",
  ACCOUNT_BROADCAST: "broadcast-account",
};
export const listenEvents = (req: MessageEvent<any>) => {
  const msg = JSON.parse(req.data);
  console.log("events", msg);

  switch (msg.event) {
    case events.GET_CHAIN:
      sendChain(msg.peerId);
      break;

    case events.LAST_BLOCK_REQUEST:
      sendLastBlock(msg.data);
      break;

    case events.CHAIN_BROAD_CAST:
      Blockchain.getBlockChain().serializeChain(msg.data);
      break;
    case events.TRANSACTION_BROADCAST:
      addToMemPool(msg.transaction);
      break;
    case events.ACCOUNT_BROADCAST:
      onAccountRecieve(msg.account);
      break;

    default:
      break;
  }
};
