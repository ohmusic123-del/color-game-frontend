const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "admin-login.html";

async function saveProb() {
  const pr = Number(document.getElementById("probRed").value);
  const pg = Number(document.getElementById("probGreen").value);
  const pv = Number(document.getElementById("probViolet").value);
  const p = document.getElementById("status");

  p.innerText = "Saving...";

  const res = await fetch(`${API_BASE}/api/admin/settings/probabilities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ probRed: pr, probGreen: pg, probViolet: pv }),
  });

  const data = await res.json();
  if (!res.ok) return (p.innerText = data.error || "Failed");

  p.innerText = "Saved ✅";
}

window.saveProb = saveProb;
