const http = require("node:http");
const { handleRoute } = require("./src/routers");

const main = () => {
  const port = 8000;

  const server = http.createServer(handleRoute);
  server.listen(port, () => console.log("listening on", port));
};

main();
