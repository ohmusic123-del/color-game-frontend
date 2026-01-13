const API = "https://color-game-backend1.onrender.com";

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

async function loadProfile() {
  const res = await fetch(API + "/profile", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Session expired");
    logout();
    return;
  }

  document.getElementById("userMobile").innerText = data.mobile;
  document.getElementById("walletBalance").innerText = "₹" + data.wallet;
  document.getElementById("totalWagered").innerText = "₹" + data.totalWagered;
}

loadProfile();
