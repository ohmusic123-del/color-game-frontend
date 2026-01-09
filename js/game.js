// frontend/js/game.js
// api.js must be loaded before this file

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

let CURRENT_ROUND_ID = null;

/* =========================
   LOAD CURRENT ROUND
========================= */
async function loadCurrentRound() {
  try {
    const res = await fetch(API + "/round/current");
    const data = await res.json();

    CURRENT_ROUND_ID = data.id;

    document.getElementById("roundId").innerText = data.id;
  } catch (err) {
    console.error("Failed to load round");
  }
}

/* =========================
   LOAD ROUND HISTORY (LAST 20)
========================= */
async function loadRoundHistory() {
  try {
    const res = await fetch(API + "/rounds/history");
    const data = await res.json();

    const list = document.getElementById("roundHistory");
    list.innerHTML = "";

    data.forEach(r => {
      list.innerHTML += `
        <div class="history-row ${r.winner}">
          <span>${r.roundId}</span>
          <span>${r.winner.toUpperCase()}</span>
        </div>
      `;
    });
  } catch (err) {
    console.error("Failed to load history");
  }
}

/* =========================
   LOAD USER BETS (CURRENT ROUND)
========================= */
async function loadMyBets() {
  try {
    const res = await fetch(API + "/bets/current", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    const list = document.getElementById("myBets");
    list.innerHTML = "";

    if (!data.bets.length) {
      list.innerHTML = "<p>No bets placed</p>";
      return;
    }

    data.bets.forEach(b => {
      list.innerHTML += `
        <div class="bet-row">
          <span>${b.color.toUpperCase()}</span>
          <span>₹${b.amount}</span>
          <span>${b.status}</span>
        </div>
      `;
    });
  } catch (err) {
    console.error("Failed to load bets");
  }
}

/* =========================
   PLACE BET
========================= */
async function placeBet(color, amount) {
  if (!amount || amount <= 0) {
    alert("Invalid amount");
    return;
  }

  try {
    const res = await fetch(API + "/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ color, amount })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Bet placed successfully");

    loadMyBets();
    loadWallet();
  } catch (err) {
    alert("Bet failed");
  }
}

/* =========================
   QUICK BET BUTTONS
========================= */
function bet1(color) {
  placeBet(color, 1);
}

function bet5(color) {
  placeBet(color, 5);
}

/* =========================
   LOAD WALLET
========================= */
async function loadWallet() {
  try {
    const res = await fetch(API + "/wallet", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    document.getElementById("wallet").innerText = data.wallet;
  } catch {}
}

/* =========================
   TAB SWITCH (HISTORY / MY BETS)
========================= */
function showHistory() {
  document.getElementById("historyTab").classList.add("active");
  document.getElementById("betsTab").classList.remove("active");

  document.getElementById("roundHistory").style.display = "block";
  document.getElementById("myBets").style.display = "none";
}

function showMyBets() {
  document.getElementById("betsTab").classList.add("active");
  document.getElementById("historyTab").classList.remove("active");

  document.getElementById("roundHistory").style.display = "none";
  document.getElementById("myBets").style.display = "block";
}

/* =========================
   INIT
========================= */
loadCurrentRound();
loadRoundHistory();
loadMyBets();
loadWallet();

// auto refresh
setInterval(() => {
  loadCurrentRound();
  loadRoundHistory();
  loadMyBets();
  loadWallet();
}, 5000);
