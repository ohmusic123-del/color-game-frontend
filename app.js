const API = "https://color-game-backend1.onrender.com";

// ✅ get token automatically
const TOKEN = localStorage.getItem("token");

// 🚫 block access if not logged in
if (!TOKEN) {
  window.location.href = "index.html";
}

// ---------------- LOAD GAME ----------------
async function loadGame() {
  try {
    const res = await fetch(API + "/api/user/me", {
      headers: {
        Authorization: "Bearer " + TOKEN
      }
    });

    const data = await res.json();

    // ✅ FIXED wallet
    document.getElementById("wallet").innerText =
      data.wallet ?? data.balance ?? 0;

    startTimer();

  } catch (err) {
    document.getElementById("wallet").innerText = "Error";
  }
}

// ---------------- PLACE BET ----------------
async function placeBet(color) {
  const amount = document.getElementById("amount").value;

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const res = await fetch(API + "/api/game/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN
      },
      body: JSON.stringify({
        color,
        amount
      })
    });

    const data = await res.json();

    // ✅ FIXED wallet + result
    document.getElementById("wallet").innerText =
      data.wallet ?? data.balance ?? 0;

    document.getElementById("msg").innerText =
      data.message || data.result || "Bet placed";

  } catch (err) {
    document.getElementById("msg").innerText = "Server error";
  }
}

// ---------------- TIMER ----------------
function startTimer() {
  let time = 30;
  const timer = document.getElementById("timer");

  setInterval(() => {
    time--;
    if (time <= 0) time = 30;
    timer.innerText = time;
  }, 1000);
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
