const net = require("net");

const server = net.createServer();

// an array of client sockets
const clients = [];

server.on("connection", (socket) => {
  console.log("a new connection to a server");

  socket.on("data", (data) => {
    clients.map((s) => {
      s.write(data);
    });
  });

  clients.push(socket);
});

server.listen(3000, "127.0.0.1", () => {
  console.log("open server on", server.address());
});
