const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  location.href = "index.html";
}

// Load wallet balance
async function loadWallet() {
  const res = await fetch(API + "/profile", {
    headers: { Authorization: token }
  });
  const data = await res.json();
  document.getElementById("walletBalance").innerText = "₹" + data.wallet;
}

loadWallet();

// Place bet
async function placeBet(color) {
  const amount = prompt("Enter bet amount:");
  if (!amount) return;

  const res = await fetch(API + "/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ color, amount: Number(amount) })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Bet failed");
    return;
  }

  alert("Bet placed successfully");
  loadWallet();
}

function showResults() {
  alert("Results feature coming soon");
}

function showMyBets() {
  alert("My Bets feature coming soon");
}
