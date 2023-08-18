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
    "/login": "text/html",
    "/guest-book": "text/html",
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

const readFile = (path, request, response, onData) => {
  fs.readFile(path, (err, content) => {
    if (err) {
      handleNotFound(path, response);
      return;
    }

    onData(request, response, content);
  });
};

const handleMethodNotAllowed = (_, res) => {
  res.writeHead(405, "Method Not Allowed");
  res.end();
};

const redirectToHome = (request, response) => {
  response.writeHead(302, { location: "/" });
  response.end();
};

const redirectToGuestBook = (request, response) => {
  response.writeHead(302, { location: "/guest-book" });
  response.end();
};

const redirectToLogin = (request, response) => {
  response.writeHead(302, { location: "/login" });
  response.end();
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

const sendCommentLog = (request, response) => {
  fs.readFile("./resource/commentLog.json", "utf-8", (err, commentLog) => {
    if (err) {
      console.error("sendCommentLog: error in reading");
      return;
    }
    response.setHeader("content-type", "application/json");
    response.end(commentLog);
  });
};

const attachTimeStampAndUsername = (commentJSON, username) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  const commentParams = JSON.parse(commentJSON);
  return { date, time, username, ...commentParams };
};

const handleNewComment = (request, response) => {
  request.setEncoding("utf-8");
  let commentJSON = "";

  const onData = (chunk) => {
    commentJSON += chunk;
  };

  const onEnd = () => {
    if (!request.cookies) {
      redirectToLogin(request, response);
      return;
    }

    const { username } = request.cookies;
    const commentParams = attachTimeStampAndUsername(commentJSON, username);
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

const login = (request, response) => {
  let requestBody = "";
  request.on("data", (chunk) => (requestBody += chunk));

  request.on("end", () => {
    console.log(requestBody);
    const { username } = Object.fromEntries(new URLSearchParams(requestBody));
    if (username) response.setHeader("Set-Cookie", `username=${username}`);

    redirectToHome(request, response);
    return;
  });
};

const serveLogin = (request, response) => {
  const path = "resource/html/login.html";
  readFile(path, request, response, render);
};

const serveGuestBook = (request, response) => {
  if (!request.headers.cookie) {
    redirectToLogin(request, response);
    return;
  }

  const path = "resource/html/guest-book.html";
  readFile(path, request, response, render);
};

const parseCookie = (rawCookies) => {
  if (!rawCookies) {
    return;
  }
  return Object.fromEntries(
    rawCookies.split("; ").map((rawCookie) => rawCookie.split("="))
  );
};

const handleRoute = (request, response) => {
  console.log(request.url);
  request.cookies = parseCookie(request.headers.cookie);
  console.log(request.cookies);

  const { url, method } = request;

  const routes = {
    GET: {
      "/": handleHome,
      "/login": serveLogin,
      "/guest-book": serveGuestBook,
      "/guest-book/comments": sendCommentLog,
    },
    POST: {
      "/guest-book/comments": handleNewComment,
      "/login": login,
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
