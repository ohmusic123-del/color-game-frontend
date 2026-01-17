const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function loadWalletHistory() {
  const div = document.getElementById("history");
  div.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_BASE}/api/wallet/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      div.innerHTML = data.error || "Failed";
      return;
    }

    div.innerHTML = `
      <div class="card">
        <h3>Deposits: ${data.deposits.length}</h3>
        <h3>Withdraws: ${data.withdraws.length}</h3>
      </div>
    `;
  } catch (e) {
    div.innerHTML = e.message;
  }
}

loadWalletHistory();
