export const receiveRequest = (
  req: MessageEvent<any>,
  dataChannels: Record<string, RTCDataChannel>
) => {
  const msg = JSON.parse(req.data);
  console.log("msg", msg);

  switch (msg.event) {
    case "get-chain":
      sendChain(msg.peerId, dataChannels);
      break;

    case "chain-broadcast":
      console.log("rec chain.", msg.data);
      break;

    default:
      break;
  }
};

function sendChain(
  peerId: string,
  dataChannels: Record<string, RTCDataChannel>
) {
  if (Object.entries(dataChannels).length === 0) {
    console.log("empty channels");
    setTimeout(() => {
      sendChain(peerId, dataChannels);
    }, 1000);
  } else {
    const payload = {
      event: "chain-broadcast",
      data: localStorage.getItem("blockchain"),
    };
    console.log("dataChannels", dataChannels);
    dataChannels[peerId].send(JSON.stringify(payload));
  }
}
