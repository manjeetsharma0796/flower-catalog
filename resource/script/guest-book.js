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
  const { username, time, date, comment } = commentParams;
  const commentContainer = createCommentContainer();

  commentContainer.appendChild(createParaElement(date));
  commentContainer.appendChild(createParaElement(time));
  commentContainer.appendChild(createParaElement(username));
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
  const comment = document.querySelector("#comment").value;
  return { comment };
};

const submitComment = (commentParams) => {
  fetch("/guest-book/comments", {
    method: "POST",
    body: JSON.stringify(commentParams),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      if (error) {
        window.location.reload();
      }
    })
    .then(prependToCommentsContainer);
};

const setupCommentForm = () => {
  const formElement = document.querySelector("#comment-form");

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const commentParams = createCommentRequest();
    submitComment(commentParams);
    formElement.reset();
  });
};

const createLogoutButton = () => {
  const logButtonElement = document.createElement("a");
  logButtonElement.id = "log-button";
  logButtonElement.href = "/logout";
  logButtonElement.innerText = "Logout";

  return logButtonElement;
};

const renderProfile = () => {
  const profileSection = document.querySelector("#profile");
  const logButtonElement = createLogoutButton();
  profileSection.append(logButtonElement);
};

window.onload = () => {
  fetchAndRenderComments();
  setupCommentForm();
  renderProfile();
};
