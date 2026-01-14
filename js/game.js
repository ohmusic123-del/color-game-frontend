const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/index.html";
}

const walletEl = document.getElementById("walletAmount");
const roundEl = document.getElementById("roundId");
const timeEl = document.getElementById("timeLeft");

async function loadWallet() {
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  walletEl.innerText = `₹${data.wallet}`;
}

async function loadRound() {
  const res = await fetch(`${API}/round/current`);
  const data = await res.json();

  roundEl.innerText = data.roundId;
  startTimer(data.remaining);
}

let timerInterval;
function startTimer(seconds) {
  clearInterval(timerInterval);
  timeEl.innerText = `${seconds}s`;

  timerInterval = setInterval(() => {
    seconds--;
    timeEl.innerText = `${seconds}s`;
    if (seconds <= 0) clearInterval(timerInterval);
  }, 1000);
}

async function placeBet(color) {
  const amount = 10; // fixed bet for now

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();
  alert(data.message || "Bet placed");
  loadWallet();
}

document.getElementById("betRed").onclick = () => placeBet("red");
document.getElementById("betGreen").onclick = () => placeBet("green");

loadWallet();
loadRound();
