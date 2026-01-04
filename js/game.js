let selectedColor = null;
let selectedAmount = 1;

const API = "https://color-game-backend1.onrender.com";

function selectColor(color) {
  selectedColor = color;
  alert("Selected " + color.toUpperCase());
}

function selectAmount(amount) {
  selectedAmount = amount;
}

async function placeBet() {
  if (!selectedColor) {
    alert("Please select a color");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    location.href = "index.html";
    return;
  }

  const res = await fetch(`${API}/bet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      color: selectedColor,
      amount: selectedAmount,
      roundId: Date.now()
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Bet failed");
    return;
  }

  alert("Bet placed successfully");
    }
