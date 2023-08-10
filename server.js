// const net = require("node:net");
const http = require("node:http");
const { handle } = require("./src/handler");

const main = () => {
  const port = 8000;
  const server = http.createServer(handle);

  server.listen(port, () => console.log("listening on", port));
};

main();
