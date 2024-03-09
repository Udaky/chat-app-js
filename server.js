const net = require("net");

const server = net.createServer();

// an array of client sockets
const clients = [];

server.on("connection", (socket) => {
  console.log("a new connection to a server");

  const clientId = clients.length + 1;
  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const dataString = data.toString();
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  clients.push({ id: clientId.toString(), socket });
});

server.listen(3000, "127.0.0.1", () => {
  console.log("open server on", server.address());
});
