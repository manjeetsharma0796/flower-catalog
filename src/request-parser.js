const parseRequest = (rawRequest) => {
  const [requestLine, ...rawHeaderLines] = rawRequest.split("\r\n");
  const [method, uri, protocol] = requestLine.split(" ");
  const headerInfo = Object.fromEntries(
    rawHeaderLines.map((rawHeaderLine) => rawHeaderLine.trim().split(": "))
  );

  return { method, uri, protocol, headerInfo };
};

module.exports = { parseRequest };
