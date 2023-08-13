const http = require("node:http");
const { handleRequest } = require("./src/handler");

const main = () => {
  const port = 8000;
  const server = http.createServer(handleRequest);
  server.listen(port, () => console.log("listening on", port));
};

main();
