const extractType = (uri) => {
  const type = uri.split(".").slice(1).join("");
  if (type === "jpg") {
    return `image/${type}`;
  }

  return `text/${type}`;
};

const parseRequest = (rawRequest) => {
  const [requestLine, ...rawHeaderLines] = rawRequest.split("\r\n");
  const [method, uri, protocol] = requestLine.split(" ");
  const type = extractType(uri);
  const headerInfo = Object.fromEntries(
    rawHeaderLines.map((rawHeaderLine) => rawHeaderLine.trim().split(": "))
  );
  console.log(uri);
  return { method, uri, protocol, headerInfo, type };
};

module.exports = { parseRequest };
