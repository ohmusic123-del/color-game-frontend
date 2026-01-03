const API = "https://color-game-backend1.onrender.com";

// 🔒 Redirect protection
if (location.pathname.includes("game.html")) {
  if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
  } else {
    fetchWallet();
  }
}

if (location.pathname.includes("index.html")) {
  if (localStorage.getItem("token")) {
    window.location.href = "game.html";
  }
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
    localStorage.setItem("token", data.token);
    window.location.href = "game.html";
  } else {
    alert("Login failed");
  }
}

// GAME
async function fetchWallet() {
  const res = await fetch(API + "/wallet", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
  const data = await res.json();
  document.getElementById("wallet").innerText = "Wallet: ₹" + data.wallet;
}

function setAmount(val) {
  document.getElementById("amount").value = val;
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
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ color, amount })
  });

  const data = await res.json();
  alert(data.message || "Bet placed");
  fetchWallet();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// helpers
function mobileValue() {
  return document.getElementById("mobile").value.trim();
}
function passwordValue() {
  return document.getElementById("password").value.trim();
}
