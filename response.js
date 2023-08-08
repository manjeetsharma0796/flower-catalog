const statusDetail = {
  200: "OK",
  400: "Bad Request",
  404: "Not Found",
  405: "Method Not Allowed",
};

class Response {
  #socket;
  #protocol;
  #statusCode;
  #status;
  #contentLength;
  #content;

  constructor(socket) {
    this.#socket = socket;
    this.#protocol = "HTTP/1.1";
  }

  #getCurrentDate() {
    return new Date().toUTCString();
  }

  #formatStatusLine() {
    return `${this.#protocol} ${this.#statusCode} ${this.#status}`;
  }

  #formatHeader() {
    const date = this.#getCurrentDate();
    return `date: ${date}\r\ncontent-length: ${this.#contentLength}`;
  }

  #formatResponse() {
    const statusLine = this.#formatStatusLine();
    const header = this.#formatHeader();
    const content = `${this.#content}`;

    return `${statusLine}\r\n${header}\r\n\n${content}\r\n`;
  }

  setStatus(statusCode) {
    this.#statusCode = statusCode;
    this.#status = statusDetail[statusCode];
  }

  setContent(content) {
    this.#content = content;
    this.#contentLength = content.length;
  }

  send() {
    const response = this.#formatResponse();
    this.#socket.write(response);
    this.#socket.end();
  }
}

module.exports = { Response };
