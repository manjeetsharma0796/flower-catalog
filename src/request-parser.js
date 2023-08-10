const extractType = (uri) => {
  const mime = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "html": "text/html",
    "css": "text/css",
    "": "text/plain",
    "pdf": "text/pdf",
  };

  if (uri === "/") {
    return "text/html";
  }

  const [type] = uri.match(/(\w+)$/g);
  return mime[type];
};

const parseRequest = (rawRequest) => {
  const [requestLine, ...rawHeaderLines] = rawRequest.split("\r\n");
  const [method, uri, protocol] = requestLine.split(" ");
  const type = extractType(uri);
  const headerInfo = Object.fromEntries(
    rawHeaderLines.map((rawHeaderLine) => rawHeaderLine.trim().split(": "))
  );

  return { method, uri, protocol, headerInfo, type };
};

module.exports = { parseRequest };
