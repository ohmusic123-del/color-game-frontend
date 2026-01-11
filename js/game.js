/* =========================
   GAME STATE
========================= */
let selectedColor = null;
let selectedAmount = 0;

/* =========================
   ELEMENTS
========================= */
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const betSection = document.getElementById("betSection");

const amountBtns = document.querySelectorAll(".amt-btn");
const betAmountEl = document.getElementById("betAmount");
const plusBtn = document.getElementById("plusBtn");
const placeBetBtn = document.getElementById("placeBetBtn");

const resultsList = document.getElementById("resultsList");
const myBetsList = document.getElementById("myBetsList");

/* =========================
   COLOR SELECTION
========================= */
redBtn.addEventListener("click", () => selectColor("RED"));
greenBtn.addEventListener("click", () => selectColor("GREEN"));

function selectColor(color) {
  selectedColor = color;

  redBtn.classList.remove("active");
  greenBtn.classList.remove("active");

  if (color === "RED") redBtn.classList.add("active");
  if (color === "GREEN") greenBtn.classList.add("active");

  // Show bet section only after color selected
  betSection.classList.remove("hidden");

  resetBet();
}

/* =========================
   AMOUNT SELECTION
========================= */
amountBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAmount = parseInt(btn.dataset.amt);
    updateAmount();
  });
});

/* =========================
   PLUS BUTTON (DOUBLE LOGIC)
========================= */
plusBtn.addEventListener("click", () => {
  if (selectedAmount > 0) {
    selectedAmount = selectedAmount * 2;
    updateAmount();
  }
});

/* =========================
   UPDATE AMOUNT UI
========================= */
function updateAmount() {
  betAmountEl.textContent = selectedAmount;
  placeBetBtn.disabled = selectedAmount <= 0;
}

/* =========================
   RESET BET
========================= */
function resetBet() {
  selectedAmount = 0;
  betAmountEl.textContent = "0";
  placeBetBtn.disabled = true;
}

/* =========================
   PLACE BET
========================= */
placeBetBtn.addEventListener("click", async () => {
  if (!selectedColor || selectedAmount <= 0) {
    alert("Select color and amount");
    return;
  }

  try {
    const res = await fetch(`${API}/bet/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        color: selectedColor,
        amount: selectedAmount
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Bet failed");
      return;
    }

    alert("Bet placed successfully");
    resetBet();
    loadMyBets();
  } catch (err) {
    alert("Network error");
  }
});

/* =========================
   RESULTS
========================= */
async function loadResults() {
  try {
    const res = await fetch(`${API}/round/results`);
    const data = await res.json();

    resultsList.innerHTML = "";

    data.forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>#${r.roundId}</span>
        <span class="${r.result === 'RED' ? 'red' : 'green'}">
          ${r.result}
        </span>
      `;
      resultsList.appendChild(li);
    });
  } catch (e) {
    console.log("Results error");
  }
}

/* =========================
   MY BETS
========================= */
async function loadMyBets() {
  try {
    const res = await fetch(`${API}/bet/my`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const data = await res.json();

    myBetsList.innerHTML = "";

    data.forEach(b => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>₹${b.amount}</span>
        <span class="${b.color === 'RED' ? 'red' : 'green'}">
          ${b.color}
        </span>
        <span>${b.status}</span>
      `;
      myBetsList.appendChild(li);
    });
  } catch (e) {
    console.log("My bets error");
  }
}

/* =========================
   TABS
========================= */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.getElementById("resultsTab").classList.add("hidden");
    document.getElementById("myBetsTab").classList.add("hidden");

    if (btn.dataset.tab === "results") {
      document.getElementById("resultsTab").classList.remove("hidden");
    } else {
      document.getElementById("myBetsTab").classList.remove("hidden");
    }
  });
});

/* =========================
   INIT
========================= */
loadResults();
loadMyBets();
