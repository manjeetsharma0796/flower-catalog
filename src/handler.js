const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const handleHome = (_, response) => {
  const home = fs.readFileSync("./html/index.html", "utf-8");
  response.setStatus(200);
  response.setContent(home);
  response.send();
};

const handleAbeliophyllum = (_, response) => {
  const abeliophyllum = fs.readFileSync("./html/abeliophyllum.html", "utf-8");
  response.setStatus(200);
  response.setContent(abeliophyllum);
  response.send();
};

const handleAgeratum = (_, response) => {
  const ageratum = fs.readFileSync("./html/ageratum.html", "utf-8");
  response.setStatus(200);
  response.setContent(ageratum);
  response.send();
};

const handleNotFound = (request, response) => {
  const content = `${request.uri} not found`;
  response.setStatus(404);
  response.setContent(content);
  response.send();
};

const handle = (request, response) => {
  const { uri } = request;
  const uriResponses = {
    "/": handleHome,
    "/abeliophyllum.html": handleAbeliophyllum,
    "/ageratum.html": handleAgeratum,
  };

  if (uri in uriResponses) {
    uriResponses[uri](request, response);
    return;
  }

  handleNotFound(request, response);
};

const onIncomingRequest = (socket, data) => {
  console.log(data);
  const request = parseRequest(data);
  const response = new Response(socket);
  handle(request, response);
};

const handleConnection = (socket) => {
  socket.setEncoding("utf-8");
  socket.on("data", (data) => onIncomingRequest(socket, data));
};

module.exports = { handleConnection };
