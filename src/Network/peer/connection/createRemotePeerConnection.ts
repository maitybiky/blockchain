// import networkStore from "../../state/networkstore";
import networkStore from "../../../state/networkstore";
import { logCurrentTime } from "../../utility";
import { listenEvents } from "../gossips/events";
import { sendAccountState } from "../gossips/response/sendAccount";

import { signalingServer } from "./peer";


function createPeerConnection(peerId: string) {
  const { addConnection, addDataChannel } = networkStore.getState()
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
    addDataChannel(peerId, dataChannel);

    dataChannel.onmessage = (e) => {
      console.log("Received message:", e.data);
    };
  };

  const dataChannel = pc.createDataChannel("mesh");
  dataChannel.onopen = () => {};
  dataChannel.onmessage = (e) => listenEvents(e);
  addConnection(peerId, pc);


  return pc;
}

export default createPeerConnection;
