const createParaElement = (text) => {
  const commentElement = document.createElement("p");
  commentElement.innerText = text;

  return commentElement;
};

const createCommentContainer = () => {
  const commentContainer = document.createElement("section");
  commentContainer.classList.add("user-comments");

  return commentContainer;
};

const generateCommentSection = (commentParams) => {
  const { name, time, date, comment } = commentParams;
  const commentContainer = createCommentContainer();

  commentContainer.appendChild(createParaElement(date));
  commentContainer.appendChild(createParaElement(time));
  commentContainer.appendChild(createParaElement(name));
  commentContainer.appendChild(createParaElement(comment));
  return commentContainer;
};

const parseAndAppendComments = (commentLog) => {
  const commentsContainer = document.querySelector("#comments-section");
  commentsContainer.replaceChildren("");

  commentLog.reverse().forEach((commentParams) => {
    const commentContainerElement = generateCommentSection(commentParams);
    commentsContainer.appendChild(commentContainerElement);
  });
};

const prependToCommentsContainer = (commentParams) => {
  const commentsContainer = document.querySelector("#comments-section");

  const commentContainerElement = generateCommentSection(commentParams);
  commentsContainer.prepend(commentContainerElement);
};

const fetchAndRenderComments = () => {
  fetch("/guest-book/comments")
    .then((res) => res.json())
    .then(parseAndAppendComments);
};

const createCommentRequest = () => {
  const name = document.querySelector("#name").value;
  const comment = document.querySelector("#comment").value;
  return { name, comment };
};

const postCommentParams = (commentParams) => {
  fetch("/guest-book/add-comment", {
    method: "POST",
    body: JSON.stringify(commentParams),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(prependToCommentsContainer);
};

const setupCommentForm = () => {
  const formElement = document.querySelector("#comment-form");

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const commentParams = createCommentRequest();
    postCommentParams(commentParams);
    formElement.reset();
  });
};

window.onload = () => {
  fetchAndRenderComments();
  setupCommentForm();
};
