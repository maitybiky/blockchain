import { logCurrentTime } from "../utility";
import { dataChannels, peerConnections, signalingServer } from "./peer";
import { receiveRequest } from "./receiveRequest";
import { getChainReq } from "./sendRequests";

function createPeerConnection(peerId: string) {
  const pc = new RTCPeerConnection();

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      logCurrentTime("send candidate");

      signalingServer.send(
        JSON.stringify({
          type: "candidate",
          to: peerId,
          candidate: event.candidate,
        })
      );
    }
  };

  pc.ondatachannel = (event) => {
    const dataChannel = event.channel;
    dataChannels[peerId] = dataChannel;

    dataChannel.onmessage = (e) => {
      console.log("Received message:", e.data);
    };
  };

  const dataChannel = pc.createDataChannel("mesh");
  dataChannel.onopen = () => {};
  dataChannel.onmessage = (e) => receiveRequest(e,dataChannels);

  peerConnections[peerId] = pc;
  return pc;
}

export default createPeerConnection;
