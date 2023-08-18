const redirectToGuestBook = (request, response) => {
  response.writeHead(302, { location: "/guest-book" });
  response.end();
};

const redirectToLogin = (request, response) => {
  response.writeHead(302, { location: "/login" });
  response.end();
};

module.exports = { redirectToGuestBook, redirectToLogin };
