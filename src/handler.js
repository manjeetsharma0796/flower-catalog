const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const readFile = (path, response) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) console.error(err);

    response.setStatus(200);
    response.setContent(data);
    response.send();
  });
};

const handleHome = (request, response) => {
  const path = "html/index.html";
  readFile(path, response);
};

const handleAbeliophyllum = (request, response) => {
  const path = "html/abeliophyllum.html";
  readFile(path, response);
};

const handleAgeratum = (request, response) => {
  const path = "html/ageratum.html";
  readFile(path, response);
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

const handleRequest = (socket, data) => {
  console.log(data);
  const request = parseRequest(data);
  const response = new Response(socket);
  handle(request, response);
};

const handleConnection = (socket) => {
  socket.setEncoding("utf-8");
  socket.on("data", (data) => handleRequest(socket, data));
};

module.exports = { handleConnection };
