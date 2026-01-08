const API = "https://color-game-backend1.onrender.com";

async function loadWithdraws() {
  const adminKey = document.getElementById("adminKey").value;
  if (!adminKey) {
    alert("Enter admin key");
    return;
  }

  const res = await fetch(`${API}/admin/withdraws`, {
    headers: {
      "x-admin-key": adminKey
    }
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Access denied");
    return;
  }

  const tbody = document.getElementById("withdrawTable");
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = "<tr><td colspan='6'>No withdraw requests</td></tr>";
    return;
  }

  data.forEach(w => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${w.mobile}</td>
      <td>₹${w.amount}</td>
      <td>${w.method}</td>
      <td class="status-${w.status.toLowerCase()}">${w.status}</td>
      <td>${formatDetails(w)}</td>
      <td>
        ${w.status === "PENDING" ? `
          <button class="action-btn approve" onclick="processWithdraw('${w._id}','APPROVED')">Approve</button>
          <button class="action-btn reject" onclick="processWithdraw('${w._id}','REJECTED')">Reject</button>
        ` : "-"}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function formatDetails(w) {
  if (w.method === "upi") return w.details.upiId || "-";
  if (w.method === "bank")
    return `${w.details.bankName}<br>${w.details.accountNumber}<br>${w.details.ifsc}`;
  if (w.method === "usdt") return w.details.usdtAddress;
  return "-";
}

async function processWithdraw(id, status) {
  const adminKey = document.getElementById("adminKey").value;

  const note = prompt(`Admin note for ${status} (optional):`) || "";

  const res = await fetch(`${API}/admin/withdraw/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey
    },
    body: JSON.stringify({ status, adminNote: note })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed");
    return;
  }

  alert(data.message);
  loadWithdraws();
}
