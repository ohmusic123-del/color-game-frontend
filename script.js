let balance = localStorage.getItem("balance");

if (!balance) {
  balance = 100;
  localStorage.setItem("balance", balance);
}

function updateUI() {
  document.querySelectorAll("#balance").forEach(el => {
    el.innerText = balance;
  });
}

updateUI();

function setAmount(val) {
  document.getElementById("amount").value = val;
}

function placeBet(color) {
  const amount = Number(document.getElementById("amount").value);

  if (!amount || amount < 1) {
    alert("Minimum bet is ₹1");
    return;
  }

  if (amount > balance) {
    alert("Insufficient balance");
    return;
  }

  const win = Math.random() > 0.5;
  balance = win ? balance + amount : balance - amount;

  localStorage.setItem("balance", balance);
  updateUI();

  alert(win ? "You Win 🎉" : "You Lose ❌");
}

function resetGame() {
  localStorage.removeItem("balance");
  location.reload();
}
