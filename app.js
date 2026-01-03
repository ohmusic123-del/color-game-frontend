const API = "https://game-backend1.onrender.com";
let TOKEN = localStorage.getItem("token");

// FORCE UI STATE
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("gameBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");

  if (TOKEN) {
    loadWallet();
    showGame();
  }
});

// UI HELPERS
function showGame() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("gameBox").classList.remove("hidden");
}

function setAmount(val) {
  document.getElementById("amount").value = val;
}

// AUTH
async function register() {
  const mobile = mobileValue();
  const password = passwordValue();

  const res = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();
  alert(data.message || "Registered");
}

async function login() {
  const mobile = mobileValue();
  const password = passwordValue();

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password })
  });

  const data = await res.json();

  if (data.token) {
    TOKEN = data.token;
    localStorage.setItem("token", TOKEN);
    document.getElementById("wallet").innerText = data.wallet;
    showGame();
  } else {
    alert(data.message || "Login failed");
  }
}

// GAME
async function loadWallet() {
  const res = await fetch(API + "/wallet", {
    headers: { Authorization: "Bearer " + TOKEN }
  });
  const data = await res.json();
  document.getElementById("wallet").innerText = data.wallet;
}

async function placeBet(color) {
  const amount = Number(document.getElementById("amount").value);
  if (amount < 1) {
    alert("Minimum bet is ₹1");
    return;
  }

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();
  alert(data.message || "Bet placed");
  loadWallet();
}

// HELPERS
function mobileValue() {
  return document.getElementById("mobile").value.trim();
}
function passwordValue() {
  return document.getElementById("password").value.trim();
}
