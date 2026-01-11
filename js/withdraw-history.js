const withdrawHistory = document.getElementById("withdrawHistory");

async function loadWithdrawHistory() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/wallet/withdraw-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      withdrawHistory.innerHTML = "<p class='empty'>No withdrawals found</p>";
      return;
    }

    withdrawHistory.innerHTML = "";

    data.forEach(item => {
      const row = document.createElement("div");
      row.className = "history-row";

      row.innerHTML = `
        <div>
          <strong>WITHDRAW</strong>
          <div class="date">${new Date(item.createdAt).toLocaleString()}</div>
        </div>
        <div class="withdraw">
          ₹ ${item.amount}
        </div>
      `;

      withdrawHistory.appendChild(row);
    });

  } catch (err) {
    withdrawHistory.innerHTML =
      "<p class='error'>Failed to load withdraw history</p>";
  }
}

loadWithdrawHistory();
