const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

async function loadWallet() {
  const res = await fetch(`${API}/wallet`, {
    headers: { Authorization: token }
  });
  const data = await res.json();
  document.getElementById("balance").innerText = `₹${data.wallet}`;
}

async function loadBets() {
  const res = await fetch(`${API}/bets`, {
    headers: { Authorization: token }
  });

  const bets = await res.json();
  const list = document.getElementById("betList");
  list.innerHTML = "";

  if (!bets.length) {
    list.innerHTML = "<li>No bets yet</li>";
    return;
  }

  bets.forEach(b => {
    const li = document.createElement("li");
    li.innerText =
      `${b.color.toUpperCase()} | ₹${b.amount} | ${new Date(b.createdAt).toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

loadWallet();
loadBets();

setInterval(() => {
  loadWallet();
  loadBets();
}, 5000);
