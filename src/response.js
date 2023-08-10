class Response {
  #socket;
  #protocol;
  #statusCode;
  #status;
  #contentLength;
  #content;
  #contentType;
  #contentDisposition;

  constructor(socket) {
    this.#socket = socket;
    this.#protocol = "HTTP/1.1";
  }

  #getCurrentDate() {
    return new Date().toUTCString();
  }

  #formatStatusLine() {
    return `${this.#protocol} ${this.#statusCode} ${this.#status}\n`;
  }

  #formatHeader() {
    const date = this.#getCurrentDate();
    const header = `date: ${date}\r\ncontent-length: ${
      this.#contentLength
    }\r\ncontent-type: ${this.#contentType}\r\n`;

    if (this.#contentDisposition) {
      return header + `${this.#contentDisposition}\r\n`;
    }

    return header;
  }

  includeDisposition() {
    this.#contentDisposition = `Content-disposition: attachment;`;
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

  setContent(content, type) {
    this.#content = content;
    this.#contentLength = content.length;
    this.#contentType = type;
  }

  send() {
    const startLine = this.#formatStatusLine();
    const header = this.#formatHeader();

    this.#socket.write(startLine);
    this.#socket.write(header);
    this.#socket.write("\r\n");
    this.#socket.write(this.#content);
    this.#socket.end();
  }
}

module.exports = { Response };
