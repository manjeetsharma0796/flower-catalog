const net = require("node:net");
const { handleConnection } = require("./handler");

const main = () => {
  const port = 8080;
  const server = net.createServer();
  server.on("connection", handleConnection);
  server.listen(port, () => console.log("listening on", port));
};

main();
