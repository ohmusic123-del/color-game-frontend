const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "admin-login.html";

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function loadPendingDeposits() {
  const container = document.getElementById("pendingDeposits");
  if (!container) return;
  container.innerHTML = "Loading deposits...";
  try {
    const data = await api("/api/admin/deposits/pending");
    const list = data.deposits || [];
    if (!list.length) {
      container.innerHTML = "<p>No pending deposits ✅</p>";
      return;
    }
    container.innerHTML = list
      .map(
        (d) => `
      <div class="card">
        <p><b>User:</b> ${d.userId}</p>
        <p><b>Amount:</b> ₹${d.amount}</p>
        <p><b>UTR/Ref:</b> ${d.referenceId}</p>
        <button onclick="approveDeposit('${d._id}')">Approve</button>
        <button onclick="rejectDeposit('${d._id}')">Reject</button>
      </div>
    `
      )
      .join("");
  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}

async function approveDeposit(depositId) {
  try {
    await api("/api/admin/deposits/approve", {
      method: "POST",
      body: JSON.stringify({ depositId }),
    });
    alert("Deposit approved ✅");
    loadPendingDeposits();
  } catch (e) {
    alert(e.message);
  }
}

async function rejectDeposit(depositId) {
  const reason = prompt("Reject reason?");
  if (!reason) return;
  try {
    await api("/api/admin/deposits/reject", {
      method: "POST",
      body: JSON.stringify({ depositId, reason }),
    });
    alert("Deposit rejected ✅");
    loadPendingDeposits();
  } catch (e) {
    alert(e.message);
  }
}

async function loadPendingWithdraws() {
  const container = document.getElementById("pendingWithdraws");
  if (!container) return;
  container.innerHTML = "Loading withdraws...";
  try {
    const data = await api("/api/admin/withdraws/pending");
    const list = data.withdraws || [];
    if (!list.length) {
      container.innerHTML = "<p>No pending withdraws ✅</p>";
      return;
    }
    container.innerHTML = list
      .map(
        (w) => `
      <div class="card">
        <p><b>User:</b> ${w.userId}</p>
        <p><b>Amount:</b> ₹${w.amount}</p>
        <p><b>Method:</b> ${w.method}</p>
        <p><b>UPI:</b> ${w.upiId}</p>
        <button onclick="approveWithdraw('${w._id}')">Approve</button>
        <button onclick="rejectWithdraw('${w._id}')">Reject</button>
      </div>
    `
      )
      .join("");
  } catch (e) {
    container.innerHTML = `<p>Error: ${e.message}</p>`;
  }
}

async function approveWithdraw(withdrawId) {
  try {
    await api("/api/admin/withdraws/approve", {
      method: "POST",
      body: JSON.stringify({ withdrawId }),
    });
    alert("Withdraw approved ✅");
    loadPendingWithdraws();
  } catch (e) {
    alert(e.message);
  }
}

async function rejectWithdraw(withdrawId) {
  const reason = prompt("Reject reason?");
  if (!reason) return;
  try {
    await api("/api/admin/withdraws/reject", {
      method: "POST",
      body: JSON.stringify({ withdrawId, reason }),
    });
    alert("Withdraw rejected & refunded ✅");
    loadPendingWithdraws();
  } catch (e) {
    alert(e.message);
  }
}

// Forced winner (Phase-6)
async function setForcedWinner() {
  const winner = document.getElementById("forcedWinner").value || "";
  try {
    const data = await api("/api/admin/settings/forced-winner", {
      method: "POST",
      body: JSON.stringify({ winner }),
    });
    document.getElementById("forcedWinnerStatus").innerText = `Updated ✅ Next winner: ${
      data.forcedWinner || "AUTO"
    }`;
  } catch (e) {
    document.getElementById("forcedWinnerStatus").innerText = e.message;
  }
}

window.approveDeposit = approveDeposit;
window.rejectDeposit = rejectDeposit;
window.approveWithdraw = approveWithdraw;
window.rejectWithdraw = rejectWithdraw;
window.setForcedWinner = setForcedWinner;

loadPendingDeposits();
loadPendingWithdraws();
