export const initNetwork = async () => {
  let localPeerConnection;
  let localDataChannel;

  // Create a new RTCPeerConnection
  localPeerConnection = new RTCPeerConnection();

  // Create a data channel
  localDataChannel = localPeerConnection.createDataChannel("messageChannel");

  localDataChannel.onopen = () => console.log("Data channel opened");
  localDataChannel.onmessage = (event) => {
    console.log("Message from remote peer:", event.data);
  };

  // Set up ICE candidate handling
  localPeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendIceCandidate(event.candidate);
    }
  };

  // Create an offer and set the local description
  const offer = await localPeerConnection.createOffer();
  await localPeerConnection.setLocalDescription(offer);
  console.log("Offer created:", offer);

  // Send the offer to the remote peer (manually)
  sendOffer(offer);

  function sendOffer(offer: any) {
    // Example: You would manually send this offer to the other peer via a different channel
    console.log("Send this offer to the other peer:", offer);
  }

  function sendIceCandidate(candidate: any) {
    // Example: You would manually send this ICE candidate to the other peer
    console.log("Send this ICE candidate to the other peer:", candidate);
  }
};

export const connectToPeer = async (offer: any, remoteCandidates: any) => {
  let remotePeerConnection;
  let remoteDataChannel;

  remotePeerConnection = new RTCPeerConnection();

  // Handle the received offer
  await remotePeerConnection.setRemoteDescription(
    new RTCSessionDescription(offer)
  );

  // Create an answer to send back
  const answer = await remotePeerConnection.createAnswer();
  await remotePeerConnection.setLocalDescription(answer);
  console.log("Answer created:", answer);

  // Send the answer back to Peer 1 (manually)
  sendAnswer(answer);

  function sendAnswer(answer: any) {
    // Example: You would manually send this answer back to Peer 1
    console.log("Send this answer to Peer 1:", answer);
  }

  // Handle ICE candidate
  remotePeerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendIceCandidate(event.candidate);
    }
  };

  // Set up data channel
  remotePeerConnection.ondatachannel = (event) => {
    remoteDataChannel = event.channel;
    remoteDataChannel.onopen = () => console.log("Data channel opened");
    remoteDataChannel.onmessage = (event) => {
      console.log("Message from Peer 1:", event.data);
    };
  };

  // Add received ICE candidates to the remote connection
  remoteCandidates.forEach((candidate: any) => {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });

  function sendIceCandidate(candidate: any) {
    // Example: You would manually send this ICE candidate to Peer 1
    console.log("Send this ICE candidate to Peer 1:", candidate);
  }
};
