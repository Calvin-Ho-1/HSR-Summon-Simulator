const singleSummonBtn = document.getElementById("single-summon-btn");
const multiSummonBtn = document.getElementById("multi-summon-btn")
const resultBox = document.getElementById("result");
const collectionBox = document.getElementById("collection");
const historyList = document.getElementById("history");
const bannerScreen = document.getElementById("banner-screen");
const resultScreen = document.getElementById("result-screen");
const itemScreen = document.getElementById("item-screen");


const summonPool = [
  { name: "Trash Item", rarity: "3★", color: "#999", image: "trash-can.webp" },
  { name: "Gallagher", rarity: "4★", color: "#6cf", image: "gallagher.webp" },
  { name: "Pela", rarity: "4★", color: "#6cf", image: "pela.webp" },
  { name: "Lynx", rarity: "4★", color: "#6cf", image: "lynx.webp" },
  { name: "Castorice", rarity: "5★", color: "gold", image: "castorice.webp", rateUp: true },
  { name: "Clara", rarity: "5★", color: "gold", image: "clara.webp", rateUp: false },
  { name: "Bronya", rarity: "5★", color: "gold", image: "bronya.webp", rateUp: false },
  { name: "Yanqing", rarity: "5★", color: "gold", image: "yanqing.webp", rateUp: false },
  { name: "Welt", rarity: "5★", color: "gold", image: "welt.webp", rateUp: false },
  { name: "Himeko", rarity: "5★", color: "gold", image: "himeko.webp", rateUp: false },
  { name: "Bailu", rarity: "5★", color: "gold", image: "bailu.webp", rateUp: false },
  { name: "Gepard", rarity: "5★", color: "gold", image: "bailu.webp", rateUp: false },
];

// Track state
let summonCount = 0;
let fourStarPity = 0;
let fiveStarPity = 0;
let guaranteedNextFiveStar = false;

// Load collection from storage
let collection = JSON.parse(localStorage.getItem("collection")) || {};

// Determine rarity using pity + base rates
function getRarity() {
  summonCount++;
  fourStarPity++;
  fiveStarPity++;

  if (fiveStarPity >= 90) {
    fiveStarPity = 0;
    fourStarPity = 0;
    return "5★";
  }

  if (fourStarPity >= 10) {
    fourStarPity = 0;
    return "4★";
  }

  const roll = Math.random() * 100;
  if (roll < 0.6) {
    fiveStarPity = 0;
    fourStarPity = 0;
    return "5★";
  } else if (roll < 0.6 + 5.1) {
    fourStarPity = 0;
    return "4★";
  } else {
    return "3★";
  }
}

// Pick a character from pool based on rarity and rate-up rules
function getCharacterByRarity(rarity) {
  const candidates = summonPool.filter(c => c.rarity === rarity);

  if (rarity === "5★") {
    if (guaranteedNextFiveStar) {
      guaranteedNextFiveStar = false;
      return candidates.find(c => c.rateUp);
    } else {
      const isRateUp = Math.random() < 0.5;
      if (isRateUp) {
        return candidates.find(c => c.rateUp);
      } else {
        guaranteedNextFiveStar = true;
        const nonRateUps = candidates.filter(c => !c.rateUp);
        return nonRateUps[Math.floor(Math.random() * nonRateUps.length)];
      }
    }
  }

  // For 4★ or 3★
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Add to collection and save
function addToCollection(char) {
  if (collection[char.name]) {
    collection[char.name].quantity++;
  } else {
    collection[char.name] = { ...char, quantity: 1 };
  }
  localStorage.setItem("collection", JSON.stringify(collection));
  renderCollection();
}

// Display collection
function renderCollection() {
  collectionBox.innerHTML = "";
  for (const key in collection) {
    const char = collection[key];
    const div = document.createElement("div");
    div.innerHTML = `
      <span style="color:${char.color}">${char.rarity} - ${char.name}</span> x${char.quantity}
    `;
    collectionBox.appendChild(div);
  }
}

function closeResults() {
  resultScreen.style.display = "none";
  bannerScreen.style.display = "block";
}

// On summon click
singleSummonBtn.addEventListener("click", () => {
  bannerScreen.style.display = "none";
  resultScreen.style.display = "block";

  let resultsHTML = "";

  const rarity = getRarity();
  const char = getCharacterByRarity(rarity);

  addToCollection(char);

    // History 
    const li = document.createElement("li");
    li.innerHTML = `<span style="color:${char.color}">${char.rarity} - ${char.name}</span>`;
    historyList.prepend(li);
    
    resultsHTML += `
      <div class="summon-result r${rarity[0]}">
        <img src="images/${char.image}" alt="${char.name}" />
        <div class="rarity-label">${char.rarity} - ${char.name}</div>
      </div>
    `;

    resultBox.innerHTML = resultsHTML;
});

// 10x Summon
multiSummonBtn.addEventListener("click", () => {
  bannerScreen.style.display = "none";
  resultScreen.style.display = "block";
  
  let resultsHTML = "";

  for (let i = 0; i < 10; i++) {
    const rarity = getRarity();
    const char = getCharacterByRarity(rarity);

    addToCollection(char);

    
    const li = document.createElement("li");
    li.innerHTML = `<span style="color:${char.color}">${char.rarity} - ${char.name}</span>`;
    historyList.prepend(li);

    // Build all 10 results
    resultsHTML += `
      <div class="summon-result r${rarity[0]}">
        <img src="images/${char.image}" alt="${char.name}" />
        <div class="rarity-label">${char.rarity} - ${char.name}</div>
      </div>
    `;
  }

  // Show all 10 results after loop
  resultBox.innerHTML = resultsHTML;
});

// Load on page refresh
renderCollection();



