const FULL_TIME = 30;
let timeLeft = FULL_TIME;

const circle = document.querySelector(".timer-progress");
const text = document.getElementById("timerText");

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

circle.style.strokeDasharray = CIRCUMFERENCE;

function setProgress(time) {
  const offset = CIRCUMFERENCE - (time / FULL_TIME) * CIRCUMFERENCE;
  circle.style.strokeDashoffset = offset;
}

function startTimer() {
  timeLeft = FULL_TIME;
  text.innerText = timeLeft;

  circle.classList.remove("timer-warning", "timer-danger");
  setProgress(timeLeft);

  const interval = setInterval(() => {
    timeLeft--;
    text.innerText = timeLeft;
    setProgress(timeLeft);

    // Color changes
    if (timeLeft <= 10) {
      circle.classList.add("timer-warning");
    }
    if (timeLeft <= 5) {
      circle.classList.remove("timer-warning");
      circle.classList.add("timer-danger");
    }

    if (timeLeft <= 0) {
      clearInterval(interval);
      text.innerText = "GO";
    }
  }, 1000);
}

/* START ON PAGE LOAD */
startTimer();

/* CALL THIS WHEN NEW ROUND STARTS */
function resetTimer() {
  startTimer();
}
