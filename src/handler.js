const fs = require("fs");
const { URLSearchParams } = require("url");

const getMimeType = (extension) => {
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

  return mime[extension];
};

const handleNotFound = (path, response) => {
  const content = `${path} not found`;
  const type = "text/plain";

  response.statusCode = 404;
  response.setHeader("Content-Type", type);
  response.end(content);
};

const render = (request, response, content) => {
  const [extension] = request.url.split(".").slice(-1);
  const type = getMimeType(extension);

  if (extension === "pdf")
    response.setHeader("Content-Disposition", "attachment");

  response.writeHead(200, {
    "Content-type": type,
  });
  response.end(content);
};

const readFile = (path, request, response, ondata) => {
  fs.readFile(path, (err, content) => {
    if (err) {
      handleNotFound(path, response);
      return;
    }

    ondata(request, response, content);
  });
};

const handleHome = (request, response) => {
  const path = "resource/html/index.html";
  readFile(path, request, response, render);
};

const handleFileRequest = (request, response) => {
  const path = request.url.replace("/", "");
  readFile(path, request, response, render);
};

const handleRedirection = (response, location) => {
  response.writeHead(302, {
    location,
  });
  response.end();
};

const storeComment = (querryString) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const querryParams = Object.fromEntries(new URLSearchParams(querryString));
  const path = "./resource/commentsLog.json";
  const comment = { date, time, ...querryParams };

  fs.readFile(path, "utf-8", (err, oldComments) => {
    if (err) {
      console.error("storeComment: path not exist, creating new one");
      fs.writeFile(path, JSON.stringify([comment]), () => {});
      return;
    }

    const commentsLog = JSON.parse(oldComments);
    commentsLog.push(comment);
    fs.writeFile(path, JSON.stringify(commentsLog), () => {});
  });
};

const handleNewComment = (request, response) => {
  request.setEncoding("utf-8");
  let commentData = "";

  const onData = (chunk) => {
    commentData += chunk;
  };

  const onEnd = () => {
    storeComment(commentData);
    const location = "/resource/html/guest-book.html";
    handleRedirection(response, location);
  };

  request.on("data", onData);
  request.on("end", onEnd);
  return;
};

const handleMethodNotAllowed = (_, res) => {
  res.writeHead(405, "Method Not Allowed");
  res.end();
};

const sendCommentLog = (_, response) => {
  fs.readFile("./resource/commentsLog.json", "utf-8", (err, commentsLog) => {
    if (err) {
      console.error("sendCommentLog: error in reading");
      return;
    }
    response.setHeader("content-type", "application/json");
    response.end(commentsLog);
  });
};

const handleRoute = (request, response) => {
  console.log(request.url);
  const routes = {
    GET: {
      "/": handleHome,
      "/guest-book/comments": sendCommentLog,
    },
    POST: {
      "/guest-book/add-comment": handleNewComment,
    },
  };
  const { url, method } = request;

  if (url in routes[method]) {
    routes[method][url](request, response);
    return;
  }

  if (method === "POST") {
    handleMethodNotAllowed(request, response);
    return;
  }

  handleFileRequest(request, response);
};

module.exports = { handleRoute };
