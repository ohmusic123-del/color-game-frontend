// wallet.js

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

async function loadWallet() {
  try {
    const res = await fetch(API + "/wallet", {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (data.wallet !== undefined) {
      document.getElementById("walletAmount").innerText =
        "₹" + data.wallet;
    } else {
      alert("Failed to load wallet");
    }
  } catch (err) {
    alert("Server error");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

loadWallet();
