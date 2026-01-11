const depositHistory = document.getElementById("depositHistory");

async function loadDepositHistory() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/wallet/deposit-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      depositHistory.innerHTML = "<p class='empty'>No deposits found</p>";
      return;
    }

    depositHistory.innerHTML = "";

    data.forEach(item => {
      const row = document.createElement("div");
      row.className = "history-row";

      row.innerHTML = `
        <div>
          <strong>DEPOSIT</strong>
          <div class="date">${new Date(item.createdAt).toLocaleString()}</div>
        </div>
        <div class="deposit">
          ₹ ${item.amount}
        </div>
      `;

      depositHistory.appendChild(row);
    });

  } catch (err) {
    depositHistory.innerHTML = "<p class='error'>Failed to load deposit history</p>";
  }
}

loadDepositHistory();
