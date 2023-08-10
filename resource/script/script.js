const hideWaterJug = (waterJug) => {
  const showWaterJug = () => waterJug.classList.remove("hide");

  waterJug.classList.add("hide");
  setTimeout(showWaterJug, 1000);
};

window.onload = () => {
  const waterJug = document.querySelector("#water-jug");
  waterJug.onclick = () => hideWaterJug(waterJug);
};
