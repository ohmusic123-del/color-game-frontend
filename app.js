const API = "https://color-game-backend.onrender.com";

const app = document.getElementById("app");

app.innerHTML = `
  <h1 class="text-2xl font-bold text-center mb-4">🎮 Color Prediction</h1>

  <div class="bg-white p-4 rounded shadow">
    <p class="text-center mb-3">Choose a color</p>

    <div class="grid grid-cols-3 gap-3">
      <button onclick="bet('RED')" class="bg-red-500 text-white p-3 rounded">RED</button>
      <button onclick="bet('VIOLET')" class="bg-purple-500 text-white p-3 rounded">VIOLET</button>
      <button onclick="bet('GREEN')" class="bg-green-500 text-white p-3 rounded">GREEN</button>
    </div>
  </div>

  <p id="msg" class="text-center mt-4 text-sm"></p>
`;

function bet(color) {
  document.getElementById("msg").innerText =
    "Bet placed on " + color + " (demo)";
}
