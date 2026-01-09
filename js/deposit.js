// frontend/js/deposit.js
// api.js must be loaded before this file

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

/* =========================
   LOAD WALLET BALANCE
========================= */
async function loadWallet() {
  try {
    const res = await fetch(API + "/wallet", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    if (data.error) return;

    document.getElementById("walletBalance").innerText =
      "₹" + data.wallet.toFixed(2);
  } catch (err) {
    console.error("Wallet error");
  }
}

/* =========================
   DEPOSIT MONEY
========================= */
async function deposit() {
  const amount = Number(document.getElementById("depositAmount").value);

  if (!amount || amount < 100) {
    alert("Minimum deposit is ₹100");
    return;
  }

  try {
    const res = await fetch(API + "/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Deposit successful!");
    document.getElementById("depositAmount").value = "";
    loadWallet();
  } catch (err) {
    console.error("Deposit error");
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadWallet();
});
