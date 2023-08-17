const fs = require("fs");

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

const storeComment = (commentParams) => {
  const path = "./resource/commentsLog.json";

  fs.readFile(path, "utf-8", (err, oldComments) => {
    if (err) {
      console.error("storeComment: path not exist, creating new one");
      fs.writeFile(path, JSON.stringify([commentParams]), () => {});
      return;
    }

    const commentsLog = JSON.parse(oldComments);
    commentsLog.push(commentParams);
    fs.writeFile(path, JSON.stringify(commentsLog), () => {});
  });
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

const attachTimeStamp = (commentJSON) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const commentParams = JSON.parse(commentJSON);
  return { date, time, ...commentParams };
};
const handleNewComment = (request, response) => {
  request.setEncoding("utf-8");
  let commentJSON = "";

  const onData = (chunk) => {
    commentJSON += chunk;
  };

  const onEnd = () => {
    const commentParams = attachTimeStamp(commentJSON);
    storeComment(commentParams);
    response.writeHead(200, {
      "content-type": "application/json",
    });
    response.end(JSON.stringify(commentParams));
  };

  request.on("data", onData);
  request.on("end", onEnd);
  return;
};

const handleMethodNotAllowed = (_, res) => {
  res.writeHead(405, "Method Not Allowed");
  res.end();
};

const handleRoute = (request, response) => {
  console.log(request.url);
  const { url, method } = request;
  const routes = {
    GET: {
      "/": handleHome,
      "/guest-book/comments": sendCommentLog,
    },
    POST: {
      "/guest-book/add-comment": handleNewComment,
    },
  };

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
