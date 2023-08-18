const { parseCookie } = require("./cookie-parser");
const {
  handleHome,
  serveLogin,
  serveGuestBook,
  sendCommentLog,
  handleNewComment,
  login,
  handleMethodNotAllowed,
  handleFileRequest,
} = require("./handlers");

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
