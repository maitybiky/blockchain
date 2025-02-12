import { logCurrentTime } from "../../utility";
import createPeerConnection from "./createRemotePeerConnection";
import { handleOfferReceive } from "./offer";
import { getConnection } from "../../../state/getter";
import networkStore from "../../../state/networkstore";
import { getChainReq } from "../gossips/request/reqFullChain";
import { getAccountReq } from "../gossips/request/accountRequest";

function connectToNetwork() {
  const { myPeerId, setOwnPeerId } = networkStore.getState();
  signalingServer.onmessage = async (message) => {
    const data = JSON.parse(message.data);
    console.log("signaling server events", data);
    if (data.type === "peer_coonection") {
      // Server assigns a unique ID to this peer
      const youPeerId = data.id;
      if (youPeerId) {
        setOwnPeerId(youPeerId);
        console.log("who ami i :>> ", youPeerId);
        // connectToPeer(myPeerId);
      } else {
        throw new Error("Peer id is null!");
      }
      for (const peerId of data.peers) {
        if (peerId !== myPeerId) {
          logCurrentTime("new join");
          connectToPeer(peerId);
          // createPeerConnection(peerId); // Connect to existing peers
        }
      }
    } else if (data.type === "offer") {
      logCurrentTime("rec offer");

      handleOfferReceive(data);
    } else if (data.type === "answer") {
      logCurrentTime("rec answer");

      // Received an answer to our offer
      const pc = getConnection(data.to);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else {
        console.error("peer not found!!!");
      }

    } else if (data.type === "candidate") {
      logCurrentTime("rec candidate");
      console.log('data :>> ', data);

      // Received an ICE candidate
      const pc = getConnection(data.to);

      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    }
  };

  async function connectToPeer(peerId: string) {
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    logCurrentTime("sending offer");

    const offerPayload = JSON.stringify({
      type: "offer",
      from: peerId,
      offer: pc.localDescription,
    });
    signalingServer.send(offerPayload);
  }
}
export const signalingServer = new WebSocket("ws://localhost:8080");
export default connectToNetwork;

//connectToPeer(peerId) - to initiate process of joining the mesh [it initate your own peer whit a peer id returned from signalling server]
