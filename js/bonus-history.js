const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function loadBonusLogs() {
  const div = document.getElementById("bonusLogs");
  div.innerHTML = "Loading...";

  const res = await fetch(`${API_BASE}/api/user/bonus-logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    div.innerHTML = data.error || "Failed";
    return;
  }

  const logs = data.logs || [];
  if (!logs.length) {
    div.innerHTML = "<p>No bonus history found ✅</p>";
    return;
  }

  div.innerHTML = logs
    .map(
      (l) => `
      <div class="card">
        <p><b>Amount:</b> ₹${l.amount}</p>
        <p><b>Level:</b> ${l.level}</p>
        <p><b>Type:</b> ${l.type}</p>
        <p style="font-size:12px;opacity:0.8">${new Date(l.createdAt).toLocaleString()}</p>
      </div>
    `
    )
    .join("");
}

loadBonusLogs();
