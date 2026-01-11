/* =========================
   CONFIG
========================= */
const token = localStorage.getItem("token");
if (!token) location.href = "index.html";

/* =========================
   STATE
========================= */
let selectedColor = null;
let betAmount = 0;

/* =========================
   ELEMENTS
========================= */
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const betSection = document.getElementById("betSection");
const betAmountEl = document.getElementById("betAmount");
const placeBetBtn = document.getElementById("placeBetBtn");
const plusBtn = document.getElementById("plusBtn");

const resultsList = document.getElementById("resultsList");
const myBetsList = document.getElementById("myBetsList");

const tabBtns = document.querySelectorAll(".tab-btn");
const resultsTab = document.getElementById("resultsTab");
const myBetsTab = document.getElementById("myBetsTab");

/* =========================
   COLOR SELECTION
========================= */
redBtn.onclick = () => selectColor("red");
greenBtn.onclick = () => selectColor("green");

function selectColor(color) {
  selectedColor = color;

  redBtn.classList.remove("active");
  greenBtn.classList.remove("active");

  if (color === "red") redBtn.classList.add("active");
  if (color === "green") greenBtn.classList.add("active");

  betSection.classList.remove("hidden");
  resetBet();
}

/* =========================
   BET AMOUNT
========================= */
document.querySelectorAll(".amt-btn").forEach(btn => {
  btn.onclick = () => {
    betAmount = Number(btn.dataset.amt);
    updateBetUI();
  };
});

plusBtn.onclick = () => {
  if (betAmount > 0) {
    betAmount *= 2;
    updateBetUI();
  }
};

function updateBetUI() {
  betAmountEl.innerText = betAmount;
  placeBetBtn.disabled = betAmount <= 0 || !selectedColor;
}

/* =========================
   PLACE BET
========================= */
placeBetBtn.onclick = async () => {
  if (!selectedColor || betAmount <= 0) return;

  placeBetBtn.disabled = true;

  try {
    const res = await fetch(API + "/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        color: selectedColor,
        amount: betAmount
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Bet failed");
    } else {
      resetBet();
      loadMyBets();
    }
  } catch {
    alert("Network error");
  }

  placeBetBtn.disabled = false;
};

function resetBet() {
  betAmount = 0;
  betAmountEl.innerText = "0";
  placeBetBtn.disabled = true;
}

/* =========================
   TABS
========================= */
tabBtns.forEach(btn => {
  btn.onclick = () => {
    tabBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (btn.dataset.tab === "results") {
      resultsTab.classList.remove("hidden");
      myBetsTab.classList.add("hidden");
    } else {
      myBetsTab.classList.remove("hidden");
      resultsTab.classList.add("hidden");
    }
  };
});

/* =========================
   LOAD ROUND RESULTS
========================= */
async function loadResults() {
  const res = await fetch(API + "/rounds/history");
  const data = await res.json();

  resultsList.innerHTML = "";

  data.slice(0, 10).forEach(r => {
    resultsList.innerHTML += `
      <li class="list-item ${r.winner}">
        <span>Round ${r.roundId}</span>
        <strong>${r.winner.toUpperCase()}</strong>
      </li>
    `;
  });
}

/* =========================
   LOAD USER BETS
========================= */
async function loadMyBets() {
  const res = await fetch(API + "/bets", {
    headers: { Authorization: token }
  });

  const data = await res.json();
  myBetsList.innerHTML = "";

  data.slice(0, 10).forEach(b => {
    myBetsList.innerHTML += `
      <li class="list-item">
        <span>${b.color.toUpperCase()} – ₹${b.amount}</span>
        <strong class="${b.status?.toLowerCase()}">${b.status || "PENDING"}</strong>
      </li>
    `;
  });
}

/* =========================
   INIT
========================= */
loadResults();
loadMyBets();
