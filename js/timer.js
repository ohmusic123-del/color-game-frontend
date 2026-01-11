/* =========================
   ROUND TIMER
========================= */

const roundTimeEl = document.getElementById("roundTimer");

let roundEndTime = 0;

/* =========================
   FETCH CURRENT ROUND
========================= */
async function loadRound() {
  try {
    const res = await fetch(`${API}/round/current`);
    const data = await res.json();

    // Round is always 30 seconds
    roundEndTime = data.startTime + 30 * 1000;
  } catch (err) {
    console.error("Failed to load round", err);
  }
}

/* =========================
   UPDATE TIMER
========================= */
function updateTimer() {
  if (!roundEndTime) return;

  const now = Date.now();
  let remaining = Math.floor((roundEndTime - now) / 1000);

  if (remaining < 0) remaining = 0;

  roundTimeEl.innerText = remaining + "s";

  // Disable betting when round ends
  if (remaining === 0) {
    if (typeof disableBetting === "function") {
      disableBetting();
    }
  }
}

/* =========================
   OPTIONAL: DISABLE BET UI
========================= */
function disableBetting() {
  const placeBtn = document.getElementById("placeBetBtn");
  if (placeBtn) placeBtn.disabled = true;
}

/* =========================
   INIT
========================= */
loadRound();
setInterval(updateTimer, 1000);

// Reload round every 30 seconds (sync safety)
setInterval(loadRound, 30000);
