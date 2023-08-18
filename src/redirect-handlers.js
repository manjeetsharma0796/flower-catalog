const redirectToGuestBook = (_, response) => {
  response.writeHead(302, { location: "/guest-book" });
  response.end();
};

const redirectToLogin = (_, response) => {
  response.writeHead(302, { location: "/login" });
  response.end();
};

const redirectToHomePage = (_, response) => {
  response.writeHead(302, { location: "/" });
  response.end();
};

module.exports = { redirectToGuestBook, redirectToLogin, redirectToHomePage };
