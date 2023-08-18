const parseCookie = (rawCookies) => {
  if (!rawCookies) {
    return;
  }
  return Object.fromEntries(
    rawCookies.split("; ").map((rawCookie) => rawCookie.split("="))
  );
};

module.exports = { parseCookie };
