const hideWaterJug = (waterJug) => {
  const showWaterJug = () => waterJug.classList.remove("hide");

  waterJug.classList.add("hide");
  setTimeout(showWaterJug, 1000);
};

const createUserElement = (username) => {
  const userElement = document.createElement("p");
  userElement.innerText = `Welcome ${username}`;
  return userElement;
};

const createLogButton = (isUserPresent) => {
  const logButtonElement = document.createElement("a");
  logButtonElement.id = "log-button";
  logButtonElement.href = "/login";
  logButtonElement.innerText = "Login";

  if (isUserPresent) {
    logButtonElement.href = "/logout";
    logButtonElement.innerText = "Logout";
  }

  return logButtonElement;
};

const renderProfile = (loginInfo) => {
  const profileContainer = document.querySelector("#profile");
  const isUserPresent = "username" in loginInfo;
  if (isUserPresent) {
    const usernameElement = createUserElement(loginInfo.username);
    profileContainer.appendChild(usernameElement);
  }

  const logButton = createLogButton(isUserPresent);
  profileContainer.appendChild(logButton);
};

const fetchProfileState = () => {
  fetch("/profile-state", { method: "POST" })
    .then((res) => res.json())
    .then(renderProfile);
};

window.onload = () => {
  const waterJug = document.querySelector("#water-jug");
  waterJug.onclick = () => hideWaterJug(waterJug);
  fetchProfileState();
};
