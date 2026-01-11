const historyList = document.getElementById("historyList");

async function loadWalletHistory() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/wallet/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      historyList.innerHTML = "<p class='empty'>No transactions found</p>";
      return;
    }

    historyList.innerHTML = "";

    data.forEach(tx => {
      const row = document.createElement("div");
      row.className = "history-row";

      row.innerHTML = `
        <div>
          <strong>${tx.type.toUpperCase()}</strong>
          <div class="date">${new Date(tx.createdAt).toLocaleString()}</div>
        </div>
        <div class="${tx.type}">
          ₹ ${tx.amount}
        </div>
      `;

      historyList.appendChild(row);
    });

  } catch (err) {
    historyList.innerHTML = "<p class='error'>Failed to load history</p>";
  }
}

loadWalletHistory();
