// deposit.js

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function setAmount(amount) {
  document.getElementById("depositAmount").value = amount;
}

async function submitDeposit() {
  const amount = Number(
    document.getElementById("depositAmount").value
  );

  if (amount < 100) {
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

    if (!res.ok) {
      alert(data.error || "Deposit failed");
      return;
    }

    alert("Deposit successful");
    window.location.href = "wallet.html";
  } catch (err) {
    alert("Server error");
  }
}
