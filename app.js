// ===============================
// CONFIG
// ===============================
const API_URL = "https://color-game-backend1.onrender.com";

// ===============================
// LOGIN
// ===============================
async function login() {
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  if (!mobile || !password) {
    alert("Enter mobile and password");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // SAVE TOKEN & WALLET
    localStorage.setItem("token", data.token);
    localStorage.setItem("wallet", data.wallet);

    // REDIRECT TO GAME
    window.location.href = "game.html";

  } catch (err) {
    alert("Server error");
  }
}

// ===============================
// LOAD WALLET ON GAME PAGE
// ===============================
function loadWallet() {
  const wallet = localStorage.getItem("wallet");
  if (wallet) {
    document.getElementById("wallet").innerText = wallet;
  }
}

// ===============================
// PLACE BET
// ===============================
async function placeBet(color) {
  const amount = document.getElementById("amount").value;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login again");
    window.location.href = "index.html";
    return;
  }

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/bet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        color: color,
        amount: Number(amount)
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Bet failed");
      return;
    }

    // UPDATE WALLET
    localStorage.setItem("wallet", data.wallet);
    document.getElementById("wallet").innerText = data.wallet;

    alert(`Result: ${data.result}`);

  } catch (err) {
    alert("Server error");
  }
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("wallet");
  window.location.href = "index.html";
}
