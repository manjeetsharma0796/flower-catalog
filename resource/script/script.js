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

const createLogButton = (username) => {
  const logButtonElement = document.createElement("a");
  logButtonElement.id = "log-button";

  logButtonElement.href = "/login";
  logButtonElement.innerText = "Login";

  if (username) {
    logButtonElement.href = "/logout";
    logButtonElement.innerText = "Logout";
  }

  return logButtonElement;
};

const renderProfile = () => {
  const profileSection = document.querySelector("#profile");
  const { username } = Object.fromEntries([document.cookie.split("=")]);
  console.log(username);
  if (username) {
    const userElement = createUserElement(username);
    profileSection.append(userElement);
  }
  const logButtonElement = createLogButton(username);
  profileSection.append(logButtonElement);
};

window.onload = () => {
  const waterJug = document.querySelector("#water-jug");
  waterJug.onclick = () => hideWaterJug(waterJug);
  renderProfile();
};
