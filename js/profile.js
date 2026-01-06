const API = "https://color-game-backend1.onrender.com";
const token = localStorage.getItem("token");

let currentMethod = null;

/* ===== LOAD PROFILE ===== */

async function loadProfile() {
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: token }
  });
  const data = await res.json();

  document.getElementById("mobile").innerText = data.mobile;
  document.getElementById("wallet").innerText = data.wallet;
  document.getElementById("wagered").innerText = data.totalWagered;
}

loadProfile();

/* ===== WITHDRAW DETAILS ===== */

function openWithdrawDetails(method) {
  currentMethod = method;

  document.getElementById("withdrawModal").style.display = "flex";

  document.getElementById("upiForm").style.display = "none";
  document.getElementById("bankForm").style.display = "none";
  document.getElementById("usdtForm").style.display = "none";

  if (method === "upi") {
    document.getElementById("withdrawTitle").innerText = "UPI Details";
    document.getElementById("upiForm").style.display = "block";
  }

  if (method === "bank") {
    document.getElementById("withdrawTitle").innerText = "Bank Details";
    document.getElementById("bankForm").style.display = "block";
  }

  if (method === "usdt") {
    document.getElementById("withdrawTitle").innerText = "USDT Details";
    document.getElementById("usdtForm").style.display = "block";
  }
}

function closeWithdrawModal() {
  document.getElementById("withdrawModal").style.display = "none";
}

/* ===== SAVE DETAILS ===== */

async function saveWithdrawDetails() {
  let body = { method: currentMethod };

  if (currentMethod === "upi") {
    body.upiId = document.getElementById("upiId").value.trim();
    if (!body.upiId) return alert("Enter UPI ID");
  }

  if (currentMethod === "bank") {
    body.bankName = document.getElementById("bankName").value.trim();
    body.accountHolder = document.getElementById("accountHolder").value.trim();
    body.accountNumber = document.getElementById("accountNumber").value.trim();
    body.ifsc = document.getElementById("ifsc").value.trim();

    if (!body.bankName || !body.accountHolder || !body.accountNumber || !body.ifsc) {
      return alert("Fill all bank details");
    }
  }

  if (currentMethod === "usdt") {
    body.usdtAddress = document.getElementById("usdtAddress").value.trim();
    if (!body.usdtAddress) return alert("Enter USDT address");
  }

  const res = await fetch(`${API}/withdraw/details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed to save details");
    return;
  }

  document.getElementById("activeMethod").innerText =
    `Active method: ${currentMethod.toUpperCase()}`;

  alert("Withdrawal details saved");
  closeWithdrawModal();
}

/* ===== LOGOUT ===== */

function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
                            }
