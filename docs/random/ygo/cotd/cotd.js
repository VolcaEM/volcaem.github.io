import { cards } from "./cards.js";
import { subtexts, specialSub } from "./subtext.js";

const cardEl      = document.getElementById("card");
const frontImg    = document.getElementById("card-front");
const overlayImg  = document.getElementById("effect-overlay");
const infoBox     = document.getElementById("card-info");
const nameEl      = document.getElementById("card-name");
const rarityEl    = document.getElementById("card-rarity");
const drawButton  = document.getElementById("draw-button");
const subEl       = document.getElementById("card-subtext");

// toggle this to switch between your Numbers-list logic vs CSV logic
let numbersMode = true;

// rarities & weighted picker (unchanged)
const rarities = [
  { name: "Comune",       weight: 0.60, effect: null },
  { name: "Ultra Rara",   weight: 0.25, effect: "images/effects/UltraEffect.png" },
  { name: "Rara Ghost",   weight: 0.05, effect: "images/effects/GhostEffect.png" },
  { name: "Rara Segreta", weight: 0.10, effect: "images/effects/SecretEffect.png" },
];
function weightedRandom(list) {
  const total = list.reduce((sum, x) => sum + x.weight, 0);
  let pick = Math.random() * total;
  for (const x of list) {
    if (pick < x.weight) return x;
    pick -= x.weight;
  }
  return list[0];
}

// ——— CSV LOADING ———
let csvRows = [];
fetch("../cards.csv")
  .then((r) => r.text())
  .then((txt) => {
    const lines = txt.trim().split("\n");
    lines.shift(); // skip header
    for (const line of lines) {
      const row = line.split("|");
      if (row.length > 1) csvRows.push(row);
    }
    console.log(`[+] Loaded ${csvRows.length} CSV rows`);
  })
  .catch((e) => {
    console.error("Could not load CSV:", e);
  });

// ——— DRAW LOGIC ———
function drawCard() {
  drawButton.classList.add("fade-out");
  drawButton.disabled = true;

  nameEl.textContent   = "❔❔❔";
  rarityEl.textContent = "???";
  subEl.textContent    = "???";

  function revealNew() {
    overlayImg.style.opacity = "0";

    if (numbersMode) {
      // — Numbers mode —
      const chosenCard   = cards[Math.floor(Math.random() * cards.length)];
      const chosenRarity = weightedRandom(rarities);

      frontImg.src = chosenCard.image;

      setTimeout(() => {
        cardEl.classList.add("flipped");
        if (chosenRarity.effect) {
          overlayImg.src     = chosenRarity.effect;
          overlayImg.style.opacity = chosenRarity.weight;
        }
      }, 100);

      setTimeout(() => {
        nameEl.textContent   = `${chosenCard.name} 🎉`;
        rarityEl.textContent = `Rarità: ${chosenRarity.name}`;

        // subtext logic (unchanged)
        let raw   = chosenCard.name.split(":")[0].replace("Numero ", "");
        let clean = raw.replace(/^[iCSF]+/, "");
        let text;
        if (clean === "XX")              text = specialSub["XX"];
        else if (parseInt(clean, 10) === 1000) text = specialSub["1000"];
        else {
          let idx = parseInt(clean, 10);
          text = subtexts[idx] || "???";
        }
        subEl.textContent = text;

        infoBox.style.opacity = "1";
        drawButton.textContent = "Ritenta";
        drawButton.disabled    = false;
        drawButton.classList.remove("fade-out");
      }, 1100);
    }
    else {
      // — CSV mode —
      if (!csvRows.length) {
        alert("CSV non pronto, riprova fra un attimo.");
        drawButton.disabled = false;
        drawButton.classList.remove("fade-out");
        return;
      }

      const row = csvRows[Math.floor(Math.random() * csvRows.length)];
      const name = row[0];
      // trova la prima colonna .png
      const imgField = row.find((f) => f.toLowerCase().endsWith(".png"));
      if (!imgField) {
        nameEl.textContent = name + " 🎉";
        rarityEl.textContent = "???";
        subEl.textContent = "???";
        infoBox.style.opacity = "1";
        drawButton.textContent = "Ritenta";
        drawButton.disabled    = false;
        drawButton.classList.remove("fade-out");
        return;
      }

      // presupponiamo che la path sia relativa a 1 cartella sopra
      frontImg.src = `../${imgField}`;

      setTimeout(() => {
        cardEl.classList.add("flipped");
      }, 100);

      setTimeout(() => {
        nameEl.textContent   = name + " 🎉";
        rarityEl.textContent = "???";
        subEl.textContent    = "???";

        infoBox.style.opacity = "1";
        drawButton.textContent = "Ritenta";
        drawButton.disabled    = false;
        drawButton.classList.remove("fade-out");
      }, 1100);
    }
  }

  if (cardEl.classList.contains("flipped")) {
    cardEl.classList.remove("flipped");
    setTimeout(revealNew, 1100);
  }
  else {
    revealNew();
  }
}

drawButton.addEventListener("click", drawCard);

