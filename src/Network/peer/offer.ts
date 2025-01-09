import { logCurrentTime } from "../utility";
import createPeerConnection from "./createRemotePeerConnection";
import { signalingServer } from "./peer";

export const handleOfferReceive = async (data: any) => {
  // Received an offer from another peer

  const pc = createPeerConnection(data.from);
  
  await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  logCurrentTime("send answer");

  signalingServer.send(
    JSON.stringify({
      type: "answer",
      to: data.from,
      answer: pc.localDescription,
    })
  );
};
