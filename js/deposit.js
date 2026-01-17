const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

async function deposit() {
  const amount = Number(document.getElementById("amount").value || 0);
  const referenceId = String(document.getElementById("referenceId").value || "").trim();
  const status = document.getElementById("status");

  status.innerText = "Submitting...";

  if (!amount || amount <= 0) {
    status.innerText = "Enter valid amount";
    return;
  }

  if (!referenceId || referenceId.length < 6) {
    status.innerText = "Enter valid UTR / Reference ID";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/wallet/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, referenceId }),
    });

    const data = await res.json();

    if (!res.ok) {
      status.innerText = data.error || "Deposit failed";
      return;
    }

    status.innerText = "Deposit request submitted ✅ Waiting for admin approval";
  } catch (e) {
    status.innerText = "Error: " + e.message;
  }
}
