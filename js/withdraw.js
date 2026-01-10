// withdraw.js

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function setAmount(amount) {
  document.getElementById("withdrawAmount").value = amount;
}

async function submitWithdraw() {
  const amount = Number(
    document.getElementById("withdrawAmount").value
  );

  if (amount < 100) {
    alert("Minimum withdrawal is ₹100");
    return;
  }

  try {
    const res = await fetch(API + "/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Withdraw failed");
      return;
    }

    alert("Withdrawal request submitted");
    window.location.href = "wallet.html";
  } catch (err) {
    alert("Server error");
  }
}
