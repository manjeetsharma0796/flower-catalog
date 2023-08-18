const { parseCookie } = require("./cookie-parser");
const {
  handleHome,
  serveLogin,
  serveLogout,
  serveGuestBook,
  sendCommentLog,
  handleNewComment,
  login,
  handleMethodNotAllowed,
  handleFileRequest,
  handleProfileState,
} = require("./handlers");

const handleRoute = (request, response) => {
  console.log(request.url);
  request.cookies = parseCookie(request.headers.cookie) || {};

  const { url, method } = request;
  const routes = {
    GET: {
      "/": handleHome,
      "/login": serveLogin,
      "/logout": serveLogout,
      "/guest-book": serveGuestBook,
      "/guest-book/comments": sendCommentLog,
    },
    POST: {
      "/guest-book/comments": handleNewComment,
      "/login": login,
      "/profile-state": handleProfileState,
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
