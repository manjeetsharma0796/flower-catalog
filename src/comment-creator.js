const createCommentsElements = (rawCommentLog) => {
  const commentLog = rawCommentLog.trim().split("\n");

  if (commentLog[0] === "") {
    return "<section></section>";
  }

  return commentLog
    .map((comments) => {
      const { date, time, name, comment } = JSON.parse(comments.trim());
      return `<section class="user-comment">
      <p class="time-stamp">${date},${time}</p> 
      <p class="username">${name}</p><p>${comment}</p>
      </section>`;
    })
    .reverse()
    .join("");
};

module.exports = { createCommentsElements };
