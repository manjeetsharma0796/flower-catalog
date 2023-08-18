const fs = require("fs");
const { getMimeType } = require("./utils.js");
const {
  redirectToGuestBook,
  redirectToLogin,
  redirectToHomePage,
} = require("./redirect-handlers.js");

const attachTimeStampAndUsername = (commentJSON, username) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const commentParams = JSON.parse(commentJSON);
  return { date, time, username, ...commentParams };
};

const handleNotFound = (path, response) => {
  const content = `${path} not found`;
  const type = "text/plain";

  response.statusCode = 404;
  response.setHeader("Content-Type", type);
  response.end(content);
};

const handleMethodNotAllowed = (_, res) => {
  res.writeHead(405, "Method Not Allowed");
  res.end();
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

const readFile = (path, request, response, onData) => {
  fs.readFile(path, (err, content) => {
    if (err) {
      handleNotFound(path, response);
      return;
    }

    onData(request, response, content);
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
  const path = "./resource/commentLog.json";

  fs.readFile(path, "utf-8", (err, oldComments) => {
    if (err) {
      console.error("storeComment: path not exist, creating new one");
      fs.writeFile(path, JSON.stringify([commentParams]), () => {});
      return;
    }

    const commentLog = JSON.parse(oldComments);
    commentLog.push(commentParams);
    fs.writeFile(path, JSON.stringify(commentLog), () => {});
  });
};

const sendCommentLog = (_, response) => {
  fs.readFile("./resource/commentLog.json", "utf-8", (err, commentLog) => {
    if (err) {
      console.error("sendCommentLog: error in reading");
      return;
    }

    response.setHeader("content-type", "application/json");
    response.end(commentLog);
  });
};

const responseAfterStore = (_, response, commentParams) => {
  response.writeHead(200, {
    "content-type": "application/json",
  });
  response.end(JSON.stringify(commentParams));
};

const handleNewComment = (request, response) => {
  request.setEncoding("utf-8");
  let commentJSON = "";

  request.on("data", (chunk) => {
    commentJSON += chunk;
  });

  request.on("end", () => {
    if (!request.cookies) {
      redirectToLogin(request, response);
      return;
    }

    const { username } = request.cookies;
    const commentParams = attachTimeStampAndUsername(commentJSON, username);
    storeComment(commentParams);
    responseAfterStore(request, response, commentParams);
  });
};

const login = (request, response) => {
  let requestBody = "";
  request.on("data", (chunk) => (requestBody += chunk));

  request.on("end", () => {
    const { username } = Object.fromEntries(new URLSearchParams(requestBody));
    if (username) response.setHeader("Set-Cookie", `username=${username}`);

    redirectToGuestBook(request, response);
    return;
  });
};

const serveLogin = (request, response) => {
  const path = "resource/html/login.html";
  readFile(path, request, response, render);
};

const serveLogout = (request, response) => {
  response.setHeader("Set-Cookie", "username=; max-age=0");
  redirectToHomePage(request, response);
};

const serveGuestBook = (request, response) => {
  if (!request.headers.cookie) {
    redirectToLogin(request, response);
    return;
  }

  const path = "resource/html/guest-book.html";
  readFile(path, request, response, render);
};

module.exports = {
  handleFileRequest,
  handleNotFound,
  handleMethodNotAllowed,
  handleHome,
  storeComment,
  sendCommentLog,
  handleNewComment,
  login,
  serveGuestBook,
  serveLogin,
  serveLogout,
};
