function openPopup(name) {
  document.getElementById("popup").style.display = "flex";
  document.getElementById("popup-name").innerText = name;
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
