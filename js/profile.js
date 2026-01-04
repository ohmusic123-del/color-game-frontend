const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

async function loadProfile() {
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: token }
  });

  const data = await res.json();

  document.getElementById("mobile").innerText = data.mobile;
  document.getElementById("wallet").innerText = data.wallet;
  document.getElementById("wagered").innerText = data.totalWagered;
}

function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
}

loadProfile();
