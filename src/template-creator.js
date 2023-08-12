const fs = require("fs");

const formTemplate = () => {
  return ` <form action="/guest-log.html">
        <h3>Leave a comment</h3>
        <section class="input-area">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" required/>
        </section>

        <section class="input-area">
          <label for="comment">Comment</label>
          <textarea name="comment" id="comment" cols="30" rows="3" required></textarea>
        </section>
        <input type="submit" value="Submit" />
      </form>`;
};

const headerTemplate = () => {
  return `<header class="heading">
      <a href="/" class="back-button"><<</a>
      Guest Book
    </header>`;
};

const headTemplate = () => {
  return ` <head>
    <title>Guest-Book</title>
    <link rel="stylesheet" href="/resource/css/guest-book-style.css" />
    <script src="/resource/script/comment-loader.js"></script>
  </head>`;
};

const getCommentTemplate = () => {
  const commentsLog = fs
    .readFileSync("./resource/commentLogs.txt", "utf-8")
    .trim()
    .split("\n");

  const commentsWithTag =
    commentsLog[0] !== ""
      ? commentsLog
          .map((comments) => {
            const { date, time, name, comment } = JSON.parse(comments.trim());
            return `<p>${date} ${time} ${name} ${comment}</p>`;
          })
          .reverse()
          .join("")
      : "";

  return `<section>
  <h3 class="comment-section">Comments</h3>
  <section>${commentsWithTag}</section></section>`;
};

const getGuestLogPage = () => {
  return `<html>
    ${headTemplate()}
    <body>
      ${headerTemplate()}
      <main>
        ${formTemplate()}
        ${getCommentTemplate()}
      </main>
    </body>
  </html>`;
};

module.exports = { getGuestLogPage };
