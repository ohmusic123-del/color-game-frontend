const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

let selectedColor = null;
let timeLeft = 30;

/* INIT */
loadWallet();
loadRound();
loadResults();
startTimer();

/* WALLET */
async function loadWallet() {
  const res = await fetch(API + "/wallet", {
    headers: { authorization: token }
  });
  const data = await res.json();
  document.getElementById("walletAmount").innerText = data.wallet;
}

/* ROUND */
async function loadRound() {
  const res = await fetch(API + "/round/current");
  const data = await res.json();
  document.getElementById("roundId").innerText = data.id;
}

/* TIMER */
function startTimer() {
  setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      timeLeft = 30;
      loadRound();
      loadResults();
      loadMyBets();
    }
    document.getElementById("timer").innerText = timeLeft;
  }, 1000);
}

/* SELECT */
function selectColor(color) {
  selectedColor = color;
  document.querySelectorAll(".bet-card").forEach(c => c.classList.remove("active"));
  document.querySelector("." + color).classList.add("active");
}

/* AMOUNT */
function setAmount(val) {
  document.getElementById("betAmount").value = val;
}

/* PLACE BET */
async function placeBet() {
  if (!selectedColor) return alert("Select color");

  const amount = Number(document.getElementById("betAmount").value);

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({ color: selectedColor, amount })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadWallet();
  loadMyBets();
}

/* TABS */
function showResults() {
  document.getElementById("resultsBox").classList.remove("hidden");
  document.getElementById("betsBox").classList.add("hidden");
  tabResults.classList.add("active");
  tabBets.classList.remove("active");
}

function showMyBets() {
  document.getElementById("betsBox").classList.remove("hidden");
  document.getElementById("resultsBox").classList.add("hidden");
  tabBets.classList.add("active");
  tabResults.classList.remove("active");
  loadMyBets();
}

/* RESULTS */
async function loadResults() {
  const res = await fetch(API + "/rounds/history");
  const data = await res.json();

  const box = document.getElementById("resultsBox");
  box.innerHTML = "";

  data.forEach(r => {
    box.innerHTML += `
      <div class="row">
        <span>${r.roundId}</span>
        <span class="dot ${r.winner}"></span>
      </div>
    `;
  });
}

/* MY BETS */
async function loadMyBets() {
  const res = await fetch(API + "/bets", {
    headers: { authorization: token }
  });
  const data = await res.json();

  const box = document.getElementById("betsBox");
  box.innerHTML = "";

  data.forEach(b => {
    box.innerHTML += `
      <div class="row">
        <span>${b.color.toUpperCase()} ₹${b.amount}</span>
        <span>${b.status || ""}</span>
      </div>
    `;
  });
      }
