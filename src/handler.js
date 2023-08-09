const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const readFile = (path, response, type) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

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

const handleRoute = (request, response) => {
  const { uri, type } = request;
  const path = uri.replace("/", "");
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
    "/html/abeliophyllum.html": handleRoute,
    "/html/ageratum.html": handleRoute,
    "/html/agapanthus.html": handleRoute,
    "/html/african.html": handleRoute,
    "/html/amaryllis.html": handleRoute,
    "/html/arctotis.html": handleRoute,
    "/resource/freshorigins.jpg": handleRoute,
    "/resource/pbase-Abeliophyllum.jpg": handleRoute,
    "/resource/pbase-agerantum.jpg": handleRoute,
    "/resource/african.jpeg": handleRoute,
    "/resource/amaryllis.jpg": handleRoute,
    "/resource/arctotis.jpg": handleRoute,
    "/resource/agapanthus.jpeg": handleRoute,
    "/css/flower-style.css": handleRoute,
    "/css/home-style.css": handleRoute,
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
