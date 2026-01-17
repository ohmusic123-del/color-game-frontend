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

async function search() {
  const q = document.getElementById("q").value.trim();
  const div = document.getElementById("results");
  div.innerHTML = "Loading...";

  try {
    const data = await api(`/api/admin/users/search?q=${encodeURIComponent(q)}`, { method: "GET" });
    const users = data.users || [];
    if (!users.length) return (div.innerHTML = "<p>No users found</p>");

    div.innerHTML = users
      .map(
        (u) => `
      <div class="card">
        <p><b>${u.username}</b></p>
        <p>ID: ${u._id}</p>
        <p>Wallet: ₹${u.wallet} | Bonus: ₹${u.bonus}</p>
        <button onclick="fillUser('${u._id}')">Select</button>
      </div>
    `
      )
      .join("");
  } catch (e) {
    div.innerHTML = e.message;
  }
}

function fillUser(id) {
  document.getElementById("userId").value = id;
}

async function updateBalance() {
  const userId = document.getElementById("userId").value.trim();
  const walletDelta = Number(document.getElementById("walletDelta").value || 0);
  const bonusDelta = Number(document.getElementById("bonusDelta").value || 0);
  const p = document.getElementById("status");

  p.innerText = "Updating...";

  try {
    const data = await api("/api/admin/users/update-wallet", {
      method: "POST",
      body: JSON.stringify({ userId, walletDelta, bonusDelta }),
    });

    p.innerText = `Updated ✅ Wallet: ₹${data.user.wallet} Bonus: ₹${data.user.bonus}`;
  } catch (e) {
    p.innerText = e.message;
  }
}

window.search = search;
window.updateBalance = updateBalance;
window.fillUser = fillUser;
