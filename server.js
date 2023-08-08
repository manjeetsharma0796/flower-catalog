const net = require("node:net");
const { handleConnection } = require("./src/handler");

const main = () => {
  const port = 8000;
  const server = net.createServer();
  server.on("connection", handleConnection);
  server.listen(port, () => console.log("listening on", port));
};

main();
