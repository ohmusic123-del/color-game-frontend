const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "admin-login.html";

let lastData = null;

async function api(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function loadReport() {
  const div = document.getElementById("report");
  div.innerHTML = "Loading...";

  try {
    lastData = await api("/api/admin/reports/transactions");
    div.innerHTML = `
      <div class="card"><b>Deposits:</b> ${lastData.deposits.length}</div>
      <div class="card"><b>Withdraws:</b> ${lastData.withdraws.length}</div>
      <div class="card"><b>Bets:</b> ${lastData.bets.length}</div>
    `;
  } catch (e) {
    div.innerHTML = e.message;
  }
}

function toCSVRow(arr) {
  return arr.map(v => `"${String(v ?? "").replaceAll('"','""')}"`).join(",");
}

function exportCSV() {
  if (!lastData) return alert("Load report first");
  const rows = [];
  rows.push(["TYPE","ID","USER","AMOUNT","STATUS","CREATED_AT"].join(","));

  for (const d of lastData.deposits) {
    rows.push(toCSVRow(["DEPOSIT", d._id, d.userId, d.amount, d.status, d.createdAt]));
  }
  for (const w of lastData.withdraws) {
    rows.push(toCSVRow(["WITHDRAW", w._id, w.userId, w.amount, w.status, w.createdAt]));
  }
  for (const b of lastData.bets) {
    rows.push(toCSVRow(["BET", b._id, b.userId, b.amount, b.status, b.createdAt]));
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "transactions_report.csv";
  a.click();
}

window.loadReport = loadReport;
window.exportCSV = exportCSV;
