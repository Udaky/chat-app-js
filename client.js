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

let id;

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, () => {
  console.log("connected to the server");

  const ask = async () => {
    const message = await rl.question("Enter a message > ");

    // move the cursor one line up
    await moveCursor(0, -1);
    // clear the current line that the cursor is in
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
  };

  ask();

  socket.on("data", async (data) => {
    // log an empty line
    console.log();
    // move cursor one line up
    await moveCursor(0, -1);
    // clear line that cursor just moved into
    await clearLine(0);

    if (data.toString().substring(0, 2) === "id") {
      // when we are getting the id...
      id = data.toString().substring(3); // grabs everything start from 4 character

      console.log(`Your ID is ${id}\n`);
    } else {
      // when we are getting the message
      console.log(data.toString());
    }

    ask();
  });
});

socket.on("end", () => {
  console.log("Connection was ended!");
});
