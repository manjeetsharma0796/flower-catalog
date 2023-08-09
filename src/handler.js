const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const readFile = (path, response, type) => {
  fs.readFile(path, (err, data) => {
    if (err) console.log(err);

    response.setStatus(200);
    response.setContent(data, type);
    response.send();
  });
};

const handleHome = (request, response) => {
  const path = "html/index.html";
  const type = "text/html";
  readFile(path, response, type);
};

const handleAbeliophyllum = (request, response) => {
  const path = "html/abeliophyllum.html";
  const type = "text/html";
  readFile(path, response, type);
};

const handleAgeratum = (request, response) => {
  const path = "html/ageratum.html";
  const type = "text/html";
  readFile(path, response, type);
};

const handleImage = (request, response) => {
  const path = request.uri.slice(1);
  const type = "image/jpg";
  readFile(path, response, type);
};

const handleNotFound = (request, response) => {
  const content = `${request.uri} not found`;
  const type = "text/plain";
  response.setStatus(404);
  response.setContent(content, type);
  response.send();
};

const handle = (request, response) => {
  const { uri } = request;
  const uriResponses = {
    "/": handleHome,
    "/abeliophyllum.html": handleAbeliophyllum,
    "/ageratum.html": handleAgeratum,
    "/resource/freshorigins.jpg": handleImage,
    "/resource/pbase-Abeliophyllum.jpg": handleImage,
    "/resource/pbase-agerantum.jpg": handleImage,
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
