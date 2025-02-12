import Blockchain from "../../../blockchain/BlockChain";
import { onAccountRecieve } from "./response/onAccountRec";
import { addToMemPool } from "./response/onTransactionRec";
import { sendAccountState } from "./response/sendAccount";
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
  GET_ACCOUNT: "get-account",
  ACCOUNT_SEND: "send-account",
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
    case events.ACCOUNT_BROADCAST: // when have latest account after mine the node initiate this event
      onAccountRecieve(msg.account);
      break;
    case events.GET_ACCOUNT: // when new user request account
     sendAccountState(msg.peerId)
     break;

    case events.ACCOUNT_SEND: // when node get request from new joiner it send its own account
      onAccountRecieve(msg.account);
      break;

    default:
      break;
  }
};
