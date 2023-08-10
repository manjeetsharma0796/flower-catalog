class Response {
  #socket;
  #protocol;
  #statusCode;
  #status;
  #headers;
  #body;

  constructor(socket) {
    this.#socket = socket;
    this.#protocol = "HTTP/1.1";
    this.#headers = {};
  }

  #getCurrentDate() {
    return new Date().toUTCString();
  }

  #formatStatusLine() {
    return `${this.#protocol} ${this.#statusCode} ${this.#status}\n`;
  }

  #formatHeader() {
    const date = `Date: ${this.#getCurrentDate()}\r\n`;

    return (
      `${date}` +
      Object.entries(this.#headers).reduce((header, headerInfo) => {
        return header + headerInfo.join(":") + "\r\n";
      }, "")
    );
  }

  setStatus(statusCode) {
    const statusDetail = {
      200: "OK",
      400: "Bad Request",
      404: "Not Found",
      405: "Method Not Allowed",
    };

    this.#statusCode = statusCode;
    this.#status = statusDetail[statusCode];
  }

  setHeader(key, value) {
    this.#headers[key] = value;
  }

  setBody(content) {
    this.#body = content;
  }

  send() {
    const startLine = this.#formatStatusLine();
    const header = this.#formatHeader();

    this.#socket.write(startLine);
    this.#socket.write(header);
    this.#socket.write("\r\n");
    this.#socket.write(this.#body);
    this.#socket.end();
  }
}

module.exports = { Response };
