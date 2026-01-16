// Enregistrer le Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker enregistré");
  });
}
//Affichage de la version
const appVersion = "v-0.2";
document.getElementById("appVersion").innerText = appVersion;

window.addEventListener("beforeunload", (event) => {
  // Annuler le rechargement de la page
  event.preventDefault();
});

let timer; // Variable pour stocker l'identifiant du setInterval

let heures = 0;
let minutes = 0;
let secondes = 0;
let dixiemes = 0;

let tempsEnregistres = []; // Tableau pour stocker les temps enregistrés

function afficherTemps() {
  document.getElementById("temps").textContent = `${heures
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secondes
    .toString()
    .padStart(2, "0")}.${dixiemes.toString().padStart(2, "0")}`;
}

function demarrerChronometre() {
  // Vérifie si le chronomètre est déjà en cours d'exécution
  if (!timer) {
    timer = setInterval(function () {
      dixiemes++;
      if (dixiemes === 100) {
        dixiemes = 0;
        secondes++;
        if (secondes === 60) {
          secondes = 0;
          minutes++;
          if (minutes === 60) {
            minutes = 0;
            heures++;
          }
        }
      }
      afficherTemps();
    }, 10);
    // Désactiver le bouton de réinitialisation
    document.getElementById("reset").disabled = true;
    document.getElementById("start").disabled = true; // Désactiver le bouton "Démarrer"
  }
}

function arreterChronometre() {
  clearInterval(timer);
  // Activer à nouveau le bouton de réinitialisation
  document.getElementById("reset").disabled = false;
}

function reinitialiserChronometre() {
  clearInterval(timer);
  timer = null;
  heures = 0;
  minutes = 0;
  secondes = 0;
  dixiemes = 0;
  afficherTemps();
  document.getElementById("reset").disabled = true;

  // Réinitialiser la liste de temps enregistrés
  tempsEnregistres = [];
  afficherTempsEnregistres(); // Mettre à jour l'affichage

  effacerLocalStorage(); // Effacer les temps enregistrés dans le localStorage

  // Activer le bouton "Démarrer"
  document.getElementById("start").disabled = false;
}

function enregistrerTemps() {
  const tempsActuel = `${heures.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secondes.toString().padStart(2, "0")}.${dixiemes
    .toString()
    .padStart(2, "0")}`;
  tempsEnregistres.push(tempsActuel);
  afficherTempsEnregistres();
  sauvegarderTempsEnregistres(); // Sauvegarder les temps enregistrés
}

function verrouillerArreter() {
  const verrouillage = document.getElementById("verrouillage");
  const boutonArreter = document.getElementById("stop");
  const boutonDemarrer = document.getElementById("start");

  if (verrouillage.checked) {
    boutonArreter.disabled = true;
    boutonDemarrer.disabled = true;
  } else {
    boutonArreter.disabled = false;
    boutonDemarrer.disabled = false;
  }
}

document.getElementById("start").addEventListener("click", demarrerChronometre);
document.getElementById("stop").addEventListener("click", arreterChronometre);
document
  .getElementById("reset")
  .addEventListener("click", reinitialiserChronometre);
document
  .getElementById("enregistrer")
  .addEventListener("click", enregistrerTemps);
document
  .getElementById("verrouillage")
  .addEventListener("change", verrouillerArreter);

function afficherTempsEnregistres() {
  const listeTempsEnregistres = document.getElementById("temps-enregistres");
  listeTempsEnregistres.innerHTML = ""; // Effacer la liste précédente

  tempsEnregistres.forEach(function (temps, index) {
    const listItem = document.createElement("li");
    listItem.textContent = `Tps ${index + 1} : ${temps}`;
    listeTempsEnregistres.prepend(listItem);
  });
}

// Fonction pour sauvegarder les temps enregistrés dans le localStorage
function sauvegarderTempsEnregistres() {
  localStorage.setItem("tempsEnregistres", JSON.stringify(tempsEnregistres));
}
// Fonction pour effacer les temps enregistrés dans le localStorage
function effacerLocalStorage() {
  localStorage.removeItem("tempsEnregistres");
}

// Fonction pour charger les temps enregistrés depuis le localStorage
function chargerTempsEnregistres() {
  const tempsEnregistresString = localStorage.getItem("tempsEnregistres");
  if (tempsEnregistresString) {
    tempsEnregistres = JSON.parse(tempsEnregistresString);
    afficherTempsEnregistres(); // Mettre à jour l'affichage
  }
}

// Appeler la fonction pour charger les temps enregistrés au chargement de la page
window.addEventListener("load", chargerTempsEnregistres);
