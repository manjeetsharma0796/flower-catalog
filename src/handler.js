const fs = require("fs");
const { URLSearchParams } = require("url");

const {
  createCommentsElements,
  getGuestTemplate,
} = require("./comment-creator.js");

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

const replaceCommentWith = (template, text) =>
  template.replace("__COMMENTS__", text);

const handleGuestBookPageOnError = (request, response, guestBookTemplate) => {
  console.log("Error, file not exists. Sending page without comments");
  const blankGuestBookPage = replaceCommentWith(guestBookTemplate, "");
  render(request, response, blankGuestBookPage);
};

const renderGuestBookPage = (
  request,
  response,
  guestBookTemplate,
  commentLog
) => {
  const commentsELements = createCommentsElements(commentLog);
  const updatedGuestBookPage = replaceCommentWith(
    guestBookTemplate,
    commentsELements
  );
  render(request, response, updatedGuestBookPage);
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
  if (request.method === "POST") {
    request.setEncoding("utf-8");
    let commentData = "";

    const onData = (chunk) => {
      commentData += chunk;
    };

    const onEnd = () => {
      storeComment(commentData);
      const location = "/guest-book.html";
      handleRedirection(response, location);
    };

    request.on("data", onData);

    request.on("end", onEnd);
    return;
  }

  const guestBookTemplate = getGuestTemplate();
  fs.readFile("resource/commentLog.txt", "utf-8", (err, commentLog) => {
    if (err) {
      handleGuestBookPageOnError(request, response, guestBookTemplate);
      return;
    }

    renderGuestBookPage(
      request,
      response,
      guestBookTemplate,
      commentLog
    );
  });
};

const handleRoute = (request, response) => {
  console.log(request.url);
  const requestUrls = {
    "/": handleHome,
    "/guest-book.html": handleGuestBookPage,
  };
  const [url] = request.url.split("?");

  if (url in requestUrls) {
    requestUrls[url](request, response);
    return;
  }

  handleFileRequest(request, response);
};

module.exports = { handleRoute };
