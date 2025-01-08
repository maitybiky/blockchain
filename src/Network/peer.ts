function connectToNetwork() {
  const peerConnections: any = {}; // To store connections with other peers
  const signalingServer = new WebSocket("ws://localhost:8080");
  const dataChannels: Record<string, RTCDataChannel> = {};
  let myPeerId: string | null;
  signalingServer.onmessage = async (message) => {
    const data = JSON.parse(message.data);
 
console.log('from signalling sever', data)
    if (data.type === "peer_coonection") {
      // Server assigns a unique ID to this peer
      myPeerId = data.id;
      console.log("Available peers:", data.peers);
      for (const peerId of data.peers) {
        if (peerId !== myPeerId) {
          connectToPeer(peerId); // Connect to existing peers
        }
      }
    } else if (data.type === "offer") {
      // Received an offer from another peer
      console.log('data', data)
      const pc = createPeerConnection(data.from);
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      signalingServer.send(
        JSON.stringify({
          type: "answer",
          to: data.from,
          answer: pc.localDescription,
        })
      );
    } else if (data.type === "answer") {
      // Received an answer to our offer
      const pc = peerConnections[data.from];
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === "candidate") {
      // Received an ICE candidate
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    }
  };

  function createPeerConnection(peerId: string) {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
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
    dataChannel.onopen = () => console.log("Data channel open");
    dataChannel.onmessage = (e) => console.log("Received message:", e.data);

    peerConnections[peerId] = pc;
    return pc;
  }

  async function connectToPeer(peerId: string) {
    console.log('peerId', peerId)
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    signalingServer.send(
      JSON.stringify({
        type: "offer",
        to: peerId,
        offer: pc.localDescription,
      })
    );
  }
  setTimeout(() => {
    broadcastData("hello")
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

export default connectToNetwork;
