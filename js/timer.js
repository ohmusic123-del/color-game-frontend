let currentRound = null;
let timerInterval = null;

async function loadRound() {
  try {
    const res = await fetch(API + "/round/current");
    const data = await res.json();

    currentRound = data;

    document.getElementById("roundId").innerText = data.id;

    startTimer(data.startTime);
  } catch (e) {
    console.error("Round load failed", e);
  }
}

function startTimer(startTime) {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - new Date(startTime)) / 1000);
    const left = Math.max(30 - elapsed, 0);

    document.getElementById("timer").innerText = left + "s";

    if (left === 0) {
      clearInterval(timerInterval);
      setTimeout(loadRound, 2000);
    }
  }, 1000);
}

loadRound();
