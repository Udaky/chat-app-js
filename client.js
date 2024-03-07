const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  console.log("connected to the server");

  const ask = async () => {
    const message = await rl.question("Enter a message > ");

    // move the cursor one line up
    await moveCursor(0, -1);
    // clear the current line that the cursor is in
    await clearLine(0);
    socket.write(message);
  };

  ask();

  socket.on("data", async (data) => {
    // log an empty line
    console.log();
    // move cursor one line up
    await moveCursor(0, -1);
    // clear line that cursor just moved into
    await clearLine(0);
    console.log(data.toString());

    ask();
  });
});

socket.on("end", () => {
  console.log("Connection was ended!");
});
