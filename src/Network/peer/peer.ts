import createPeerConnection from "./createRemotePeerConnection";
import { handleOfferReceive } from "./offer";

function connectToNetwork() {
  let myPeerId: string | null;
  signalingServer.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "peer_coonection") {
      // Server assigns a unique ID to this peer
      myPeerId = data.id;
      if (myPeerId) {
        console.log("who ami i :>> ", myPeerId);

        connectToPeer(myPeerId);
      } else {
        throw new Error("Peer id is null!");
      }
      for (const peerId of data.peers) {
        if (peerId !== myPeerId) {
          createPeerConnection(peerId); // Connect to existing peers
        }
      }
    } else if (data.type === "offer") {
      handleOfferReceive(data);
    } else if (data.type === "answer") {
      // Received an answer to our offer
      const pc = peerConnections[data.to];
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === "candidate") {
      // Received an ICE candidate
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    }
  };

  async function connectToPeer(peerId: string) {
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const offerPayload = JSON.stringify({
      type: "offer",
      from: peerId,
      offer: pc.localDescription,
    });
    signalingServer.send(offerPayload);
  }
  setTimeout(() => {
    broadcastData("hello");
  }, 5000);
  function broadcastData(message: string) {
    for (const peerId in dataChannels) {
      const dataChannel = dataChannels[peerId];
      if (dataChannel.readyState === "open") {
        dataChannel.send(message);
        console.log(`Sent message to ${peerId}:`, message);
      } else {
        console.log(`Data channel with ${peerId} is not open`);
      }
    }
  }
}
export const signalingServer = new WebSocket("ws://localhost:8080");
export const peerConnections: Record<string, RTCPeerConnection> = {}; // To store connections with other peers
export const dataChannels: Record<string, RTCDataChannel> = {};
export default connectToNetwork;

//connectToPeer(peerId) - to initiate process of joining the mesh [it initate your own peer whit a peer id returned from signalling server]
