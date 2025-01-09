const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
const clients = [];
const peers = [];

server.on("connection", (socket) => {
  console.log("+++", clients.length);
  const peerId = generateRandomString(10);
  peers.push(peerId);

  socket.send(
    JSON.stringify({
      type: "peer_coonection",
      id: peerId,
      peers,
    })
  );
  clients.push(socket);

  socket.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.from) console.log(` ${data.type} from ${data.from}`);
    if (data.to) console.log(` ${data.type} to ${data.to}`);

    // Broadcast the message to all other clients
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on("close", () => {
    const index = clients.indexOf(socket);
    const peerIndex = clients.indexOf(socket);
    if (index > -1) clients.splice(index, 1);
    if (peerIndex > -1) peers.splice(index, 1);
    console.log("---", clients.length);
  });
});
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

console.log("Signaling server is running on ws://localhost:8080");
