const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

async function loadWallet() {
  const res = await fetch(`${API}/wallet`, {
    headers: { Authorization: token }
  });
  const data = await res.json();
  document.getElementById("balance").innerText = `₹${data.wallet}`;
}

async function loadBets() {
  const res = await fetch(`${API}/bets`, {
    headers: { Authorization: token }
  });

  const bets = await res.json();
  const list = document.getElementById("betList");
  list.innerHTML = "";

  if (!bets.length) {
    list.innerHTML = "<li>No bets yet</li>";
    return;
  }

  bets.forEach(b => {
    const li = document.createElement("li");
    li.innerText =
      `${b.color.toUpperCase()} | ₹${b.amount} | ${new Date(b.createdAt).toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

loadWallet();
loadBets();

setInterval(() => {
  loadWallet();
  loadBets();
}, 5000);

function openDeposit() {
  document.getElementById("depositModal").style.display = "flex";
}

function closeDeposit() {
  document.getElementById("depositModal").style.display = "none";
}

async function submitDeposit() {
  const amount = Number(document.getElementById("depositAmount").value);

  if (amount < 100) {
    alert("Minimum deposit is ₹100");
    return;
  }

  const res = await fetch(`${API}/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Deposit failed");
    return;
  }

  alert("Deposit successful");
  closeDeposit();
  loadWallet();
}
function openWithdraw() {
  document.getElementById("withdrawModal").style.display = "flex";
}

function closeWithdraw() {
  document.getElementById("withdrawModal").style.display = "none";
}
async function submitWithdraw() {
  const amount = Number(document.getElementById("withdrawAmount").value);

  if (amount < 100) {
    alert("Minimum withdrawal is ₹100");
    return;
  }

  const res = await fetch(`${API}/withdraw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();

  // ❌ NO WITHDRAW METHOD CASE
  if (
    data.error &&
    data.error.includes("withdrawal details")
  ) {
    alert("Please add withdrawal details first");
    closeWithdraw();

    // redirect to profile after short delay
    setTimeout(() => {
      location.href = "profile.html";
    }, 500);

    return;
  }

  if (!res.ok) {
    alert(data.error || "Withdrawal failed");
    return;
  }

  alert("Withdrawal request submitted successfully");
  closeWithdraw();
  loadWallet();
}
