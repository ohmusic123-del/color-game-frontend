function setAmount(value) {
  document.getElementById("amount").value = value;
}

async function deposit() {
  const amount = Number(document.getElementById("amount").value);

  if (amount < 100) {
    alert("Minimum deposit is ₹100");
    return;
  }

  const res = await fetch(API + "/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
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
}
