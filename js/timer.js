// timer.js

let timerInterval = null;

function startTimer(roundEndTime) {
  const timerEl = document.getElementById("timeLeft");

  if (!roundEndTime) {
    timerEl.innerText = "Loading...";
    return;
  }

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const now = Date.now();
    let diff = Math.floor((roundEndTime - now) / 1000);

    if (isNaN(diff) || diff < 0) {
      timerEl.innerText = "00s";
      clearInterval(timerInterval);
      return;
    }

    timerEl.innerText = diff + "s";
  }, 1000);
}
