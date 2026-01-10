let timerInterval = null;

/* ======================
   ROUND TIMER
====================== */
async function startTimer() {
  const res = await fetch(API + "/round/current");
  const data = await res.json();

  const startTime = data.startTime;
  const timerEl = document.getElementById("timer");

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = 30 - elapsed;

    if (remaining <= 0) {
      timerEl.innerText = "00";
      clearInterval(timerInterval);

      // Reload data after round ends
      setTimeout(() => {
        loadCurrentRound();
        loadRounds();
        loadUserBets();
        startTimer();
      }, 2000);

      return;
    }

    timerEl.innerText = remaining < 10 ? "0" + remaining : remaining;
  }, 1000);
}

startTimer();
