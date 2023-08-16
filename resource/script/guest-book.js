const createParaElement = (text) => {
  const commentElement = document.createElement("p");
  commentElement.innerText = text;
  console.log(commentElement);
  return commentElement;
};

const createCommentContainer = () => {
  const commentContainer = document.createElement("section");
  commentContainer.classList.add("user-comments");
  return commentContainer;
};

const parseAndAppendComments = (commentsLog) => {
  const commentsContainer = document.querySelector("#comments-section");
  commentsLog.reverse().forEach((commentDetail) => {
    const { name, time, date, comment } = commentDetail;
    const commentContainer = createCommentContainer();
    commentContainer.appendChild(createParaElement(date));
    commentContainer.appendChild(createParaElement(time));
    commentContainer.appendChild(createParaElement(name));
    commentContainer.appendChild(createParaElement(comment));
    commentsContainer.appendChild(commentContainer);
  });
};

const fetchAndRenderComment = () => {
  fetch("/guest-book/comments")
    .then((res) => res.json())
    .then(parseAndAppendComments);
};

window.onload = () => {
  fetchAndRenderComment();
};
