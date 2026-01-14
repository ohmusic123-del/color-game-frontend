async function loadWallet() {
  try {
    const res = await fetch(API + "/wallet", {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    document.getElementById("wallet").innerText = "₹" + data.wallet;
  } catch (e) {
    console.error("Wallet error", e);
  }
}

async function placeBet(color) {
  const amount = prompt("Enter bet amount");
  if (!amount) return;

  try {
    const res = await fetch(API + "/bet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ color, amount: Number(amount) })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Bet failed");
      return;
    }

    alert("Bet placed");
    loadWallet();
    showMyBets();
  } catch (e) {
    alert("Server error");
  }
}

async function showResults() {
  const res = await fetch(API + "/rounds/history");
  const data = await res.json();

  document.getElementById("betList").innerHTML =
    data.map(r => `${r.roundId} → ${r.winner}`).join("<br>");
}

async function showMyBets() {
  const res = await fetch(API + "/bets", {
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();

  document.getElementById("betList").innerHTML =
    data.map(b => `${b.roundId} | ${b.color} | ₹${b.amount} | ${b.status}`).join("<br>");
}

loadWallet();
