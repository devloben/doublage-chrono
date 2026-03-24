// Enregistre le Service Worker
const isLocalhost =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";

if ("serviceWorker" in navigator && !isLocalhost) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker enregistré");
  });
}
//Affiche de la version
const appVersion = "v-0.2";
//document.getElementById("appVersion").innerText = appVersion;

// window.addEventListener("beforeunload", (event) => {
//   // Annuler le rechargement de la page
//   event.preventDefault();
// });

let timerIntervalId = null;
let hasStarted = false;

let hours = 0;
let minutes = 0;
let seconds = 0;
let tenths = 0;

let savedTimes = [];

const lockCheckbox = document.getElementById("lock");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");
const lapButton = document.getElementById("lap");

lockCheckbox.checked = false;
startButton.disabled = false;
stopButton.disabled = true;
resetButton.disabled = true;
lapButton.disabled = true;

function renderTime() {
  document.getElementById("time").textContent = `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${tenths.toString().padStart(2, "0")}`;
}

function startTimer() {
  // Vérifie si le chronomètre est déjà en cours d'exécution
  if (hasStarted) return;

  hasStarted = true;
  timerIntervalId = setInterval(() => {
    tenths++;
    if (tenths === 100) {
      tenths = 0;
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
      }
    }
    renderTime();
  }, 10);

  // Active la fonction lock et le bouton Lap
  lockCheckbox.checked = true;
  applyLockState();
  lapButton.disabled = false;
}

function stopTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;

  resetButton.disabled = false;
  stopButton.disabled = true;
}

function resetTimer() {
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  hasStarted = false;

  hours = 0;
  minutes = 0;
  seconds = 0;
  tenths = 0;

  renderTime();

  savedTimes = [];
  renderSavedTimes();
  clearSavedTimesStorage();

  lockCheckbox.disabled = false;
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;
  lapButton.disabled = true;
}

function addSavedTime() {
  const currentTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${tenths
    .toString()
    .padStart(2, "0")}`;
  savedTimes.push(currentTime);
  renderSavedTimes();
  persistSavedTimes();
}

function applyLockState() {
  if (lockCheckbox.checked) {
    startButton.disabled = true;
    stopButton.disabled = true;
    resetButton.disabled = true;
  } else {
    const confirmation = confirm("❗️ Dévérouiller ❓");
    if (!confirmation) {
      lockCheckbox.checked = true;
      return;
    }
    stopButton.disabled = false;
  }
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
lapButton.addEventListener("click", addSavedTime);
lockCheckbox.addEventListener("change", applyLockState);

function renderSavedTimes() {
  const savedTimesList = document.getElementById("saved-times-list");
  savedTimesList.innerHTML = "";

  savedTimes.forEach(function (time, index) {
    const listItem = document.createElement("li");
    listItem.textContent = `Tps ${index + 1} : ${time}`;
    savedTimesList.prepend(listItem);
  });
}

function persistSavedTimes() {
  localStorage.setItem("savedTimes", JSON.stringify(savedTimes));
}

function clearSavedTimesStorage() {
  localStorage.removeItem("savedTimes");
}

function loadSavedTimes() {
  const savedTimesString = localStorage.getItem("savedTimes");
  if (savedTimesString) {
    savedTimes = JSON.parse(savedTimesString);
    renderSavedTimes();
  }
}

// Charge les temps enregistrés au chargement de la page
window.addEventListener("load", loadSavedTimes);
