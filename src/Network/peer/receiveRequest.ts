import networkStore from "../../state/store";

export const receiveRequest = (req: MessageEvent<any>) => {
  const { dataChannels, updateChain } = networkStore.getState();
  const msg = JSON.parse(req.data);
  console.log("msg", msg);

  switch (msg.event) {
    case "get-chain":
      sendChain(msg.peerId);
      break;

    case "chain-broadcast":
      console.log("rec chain.", msg.data);
      updateChain(msg.data);
      break;

    default:
      break;
  }
};

function sendChain(peerId: string) {
  const { dataChannels, chain } = networkStore.getState();

  if (Object.entries(dataChannels).length === 0) {
    console.log("empty channels");
    setTimeout(() => {
      sendChain(peerId);
    }, 1000);
  } else {
    const payload = {
      event: "chain-broadcast",
      data: chain,
    };

    dataChannels[peerId].send(JSON.stringify(payload));
  }
}
