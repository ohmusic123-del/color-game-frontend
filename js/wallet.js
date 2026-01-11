async function loadWallet() {
  const res = await fetch(API + "/profile", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const data = await res.json();

  if (data.error) {
    logout();
    return;
  }

  document.getElementById("wallet").innerText = data.wallet;
  document.getElementById("wagered").innerText = data.totalWagered;
  document.getElementById("bonus").innerText = data.bonus || 0;
  document.getElementById("deposited").innerText = data.deposited ? "Yes" : "No";
}

loadWallet();
