const fs = require("fs");

const getMimeType = (url) => {
  const mime = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "html": "text/html",
    "css": "text/css",
    "txt": "text/plain",
    "pdf": "text/pdf",
  };

  if (url === "/") {
    return "text/html";
  }
  
  const [type] = url.match(/(\w+)$/g);
  return mime[type];
};

const handleNotFound = (path, response) => {
  const content = `${path} not found`;
  const type = "text/plain";

  response.statusCode = 404;
  response.setHeader("Content-Type", type);
  response.end(content);
};

const handleResponse = (path, response, type) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      handleNotFound(path, response);
      return;
    }

    response.writeHead(200, {
      "Content-type": type,
      "Content-Length": data.length,
    });
    response.end(data);
  });
};

const handleHome = (_, response) => {
  const path = "resource/html/index.html";
  const type = "text/html";
  handleResponse(path, response, type);
};

const handleRoute = (request, response) => {
  const path = request.url.replace("/", "");
  const type = getMimeType(request.url);
  handleResponse(path, response, type);
};

const handle = (request, response) => {
  if (request.url === "/") {
    handleHome(request, response);
    return;
  }

  const [extension] = request.url.split(".").slice(-1);

  if (extension === "pdf") {
    response.setHeader("Content-Disposition", "attachment");
  }

  handleRoute(request, response);
};

module.exports = { handle };
