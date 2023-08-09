const fs = require("fs");

const { parseRequest } = require("./request-parser");
const { Response } = require("./response");

const handleNotFound = (path, response) => {
  const content = `${path} not found`;
  const type = "text/plain";

  response.setStatus(404);
  response.setContent(content, type);
  response.send();
};

const readFile = (path, response, type) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      handleNotFound(path, response);
      return;
    }

    response.setStatus(200);
    response.setContent(data, type);
    response.send();
  });
};

const handleHome = (_, response) => {
  const path = "resource/html/index.html";
  const type = "text/html";
  readFile(path, response, type);
};

const handleRoute = (request, response) => {
  const { uri, type } = request;
  const path = uri.replace("/", "");
  readFile(path, response, type);
};

const handle = (request, response) => {
  if (request.uri === "/") {
    handleHome(request, response);
    return;
  }

  handleRoute(request, response);
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
