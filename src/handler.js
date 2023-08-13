const fs = require("fs");
const { URLSearchParams } = require("url");
const { createCommentsElements } = require("./comment-creator.js");

const getMimeType = (url) => {
  const mime = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "ico": "image/vnd.microsoft.icon",
    "gif": "image/gif",
    "html": "text/html",
    "css": "text/css",
    "txt": "text/plain",
    "pdf": "application/pdf",
    "js": "text/javascript",
    "/": "text/html",
  };

  const [type] = url.split(".").slice(-1);
  return mime[type];
};

const handleNotFound = (path, response) => {
  const content = `${path} not found`;
  const type = "text/plain";

  response.statusCode = 404;
  response.setHeader("Content-Type", type);
  response.end(content);
};

const handleResponse = (request, response, data) => {
  const type = getMimeType(request.url);

  response.writeHead(200, {
    "Content-type": type,
    "Content-Length": data.length,
  });

  response.end(data);
};

const readFile = (path, request, response, onData) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      handleNotFound(path, response);
      return;
    }

    onData(request, response, data);
  });
};

const handleHome = (request, response) => {
  const path = "resource/html/index.html";
  readFile(path, request, response, handleResponse);
};

const handleRoute = (request, response) => {
  const path = request.url.replace("/", "");
  readFile(path, request, response, handleResponse);
};

const handleRedirection = (request, response, data) => {
  const [location] = request.url.split("?");
  const type = getMimeType(location);

  response.writeHead(302, {
    "Location": location,
    "Content-Type": type,
    "Content-Length": data.length,
  });

  response.end(data);
};

const storeComment = (querryString) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const querryParams = Object.fromEntries(new URLSearchParams(querryString));
  const path = "./resource/commentLog.txt";
  const comment = JSON.stringify({ date, time, ...querryParams }) + "\n";

  fs.appendFileSync(path, comment);
};

const handleGuestBookPage = (request, response) => {
  const [url, querryString] = request.url.split("?");
  if (querryString) storeComment(querryString);

  fs.readFile("resource/commentLog.txt", "utf-8", (err, commentLog) => {
    const guestBookTemplate = fs.readFileSync(
      "./resource/html/guest-book.html",
      "utf-8"
    );

    if (err) {
      console.log("error, file not exists.Sending page without comments");
      const blankGuestBookPage = guestBookTemplate.replace("__COMMENTS__", "");
      handleResponse(request, response, blankGuestBookPage);
      return;
    }

    const commentsELements = createCommentsElements(commentLog);
    const updatedGuestBookPage = guestBookTemplate.replace(
      "__COMMENTS__",
      commentsELements
    );

    if (request.url.includes("?")) {
      handleRedirection(request, response, updatedGuestBookPage);
      return;
    }

    handleResponse(request, response, updatedGuestBookPage);
  });
};

const handleRequest = (request, response) => {
  console.log(request.url);
  const requestUrls = {
    "/": handleHome,
    "/guest-book.html": handleGuestBookPage,
  };
  const [url, querryString] = request.url.split("?");
  const [extension] = url.split(".").slice(-1);

  if (url in requestUrls) {
    requestUrls[url](request, response);
    return;
  }

  if (extension === "pdf")
    response.setHeader("Content-Disposition", "attachment");

  handleRoute(request, response);
};

module.exports = { handleRequest };
