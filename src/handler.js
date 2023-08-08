const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const handleHome = (_, response) => {
  const home = fs.readFileSync("./resource/index.html", "utf-8");
  response.setContent(home);
  response.setStatus(200);
  response.send();
};

const handleNotFound = (request, response) => {
  const content = `${request.uri} not found`;
  response.setStatus(404);
  response.setContent(content);
  response.send();
};

const handleValidUri = (request, response) => {
  const { uri } = request;
  const uriResponses = {
    "/": handleHome,
  };

  if (uri in uriResponses) {
    uriResponses[uri](request, response);
    return;
  }

  handleNotFound(request, response);
};

const handle = (request, response) => {
  handleValidUri(request, response);
};

const onIncomingRequest = (socket, data) => {
  const request = parseRequest(data);
  const response = new Response(socket);
  handle(request, response);
};

const handleConnection = (socket) => {
  socket.setEncoding("utf-8");
  socket.on("data", (data) => onIncomingRequest(socket, data));
};

module.exports = { handleConnection };