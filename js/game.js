const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

let selectedAmount = 0;
let selectedColor = null;

/* ======================
   ROUND INFO
====================== */
async function loadRound() {
  const res = await fetch(`${API}/round/current`);
  const data = await res.json();
  document.getElementById("roundId").innerText = data.id;
}

/* ======================
   ROUND HISTORY
====================== */
async function loadHistory() {
  const res = await fetch(`${API}/rounds/history`);
  const rounds = await res.json();

  const ul = document.getElementById("history");
  ul.innerHTML = "";

  rounds.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.roundId} → ${r.winner.toUpperCase()}`;
    ul.appendChild(li);
  });
}

/* ======================
   SELECT AMOUNT / COLOR
====================== */
function setAmount(amount) {
  selectedAmount = amount;
  document.getElementById("selectedAmount").innerText = amount;
}

function selectColor(color) {
  selectedColor = color;
  alert(`Selected ${color.toUpperCase()}`);
}

/* ======================
   PLACE BET
====================== */
async function placeBet() {
  if (!selectedColor || selectedAmount < 1) {
    alert("Select color & amount");
    return;
  }

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      color: selectedColor,
      amount: selectedAmount
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Bet failed");
    return;
  }

  alert("Bet placed successfully");

  // reset
  selectedAmount = 0;
  selectedColor = null;
  document.getElementById("selectedAmount").innerText = 0;
}

/* ======================
   INIT
====================== */
loadRound();
loadHistory();

setInterval(() => {
  loadRound();
  loadHistory();
}, 5000);
function showResult(result) {
  const card = document.querySelector(".card");

  // Remove old states
  card.classList.remove("win", "lose");

  // Create floating text
  const text = document.createElement("div");
  text.classList.add("result-text");

  if (result === "WIN") {
    card.classList.add("win");
    text.classList.add("result-win");
    text.innerText = "WIN 🎉";
  } else {
    card.classList.add("lose");
    text.classList.add("result-lose");
    text.innerText = "LOSE ❌";
  }

  document.body.appendChild(text);

  // Cleanup
  setTimeout(() => {
    card.classList.remove("win", "lose");
    text.remove();
  }, 1500);
}
