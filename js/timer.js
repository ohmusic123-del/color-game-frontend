// frontend/js/timer.js
// api.js must be loaded before this file

let ROUND_DURATION = 30; // seconds
let remaining = ROUND_DURATION;

/* =========================
   START ROUND TIMER
========================= */
function startTimer() {
  const timerEl = document.getElementById("timer");

  if (!timerEl) return;

  setInterval(async () => {
    try {
      const res = await fetch(API + "/round/current");
      const data = await res.json();

      const elapsed = Math.floor(
        (Date.now() - data.startTime) / 1000
      );

      remaining = ROUND_DURATION - elapsed;

      if (remaining <= 0) {
        timerEl.innerText = "00";
        timerEl.classList.add("danger");
      } else {
        timerEl.innerText = remaining.toString().padStart(2, "0");

        if (remaining <= 5) {
          timerEl.classList.add("danger");
        } else {
          timerEl.classList.remove("danger");
        }
      }
    } catch (err) {
      console.error("Timer error");
    }
  }, 1000);
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", startTimer);
