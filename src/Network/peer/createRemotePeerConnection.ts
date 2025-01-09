import { dataChannels, peerConnections, signalingServer } from "./peer";

function createPeerConnection(peerId: string) {
  const pc = new RTCPeerConnection();

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      signalingServer.send(
        JSON.stringify({
          type: "candidate",
          from: peerId,
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
  dataChannel.onopen = () => console.log("Data channel open");
  dataChannel.onmessage = (e) => console.log("Received message:", e.data);

  peerConnections[peerId] = pc;
  return pc;
}

export default createPeerConnection