const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const handleHome = (_, response) => {
  fs.readFile("./html/index.html", "utf-8", (err, data) => {
    if (err) console.error(err);

    response.setStatus(200);
    response.setContent(data);
    response.send();
  });
};

const handleAbeliophyllum = (_, response) => {
  fs.readFile("./html/abeliophyllum.html", "utf-8", (err, data) => {
    if (err) console.error(err);

    response.setStatus(200);
    response.setContent(data);
    response.send();
  });
};

const handleAgeratum = (_, response) => {
  fs.readFile("./html/ageratum.html", "utf-8", (err, data) => {
    if (err) console.error(err);

    response.setStatus(200);
    response.setContent(data);
    response.send();
  });
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
  const request = parseRequest(data);
  const response = new Response(socket);
  handle(request, response);
};

const handleConnection = (socket) => {
  socket.setEncoding("utf-8");
  socket.on("data", (data) => onIncomingRequest(socket, data));
};

module.exports = { handleConnection };
