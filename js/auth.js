async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
console.log("REGISTER URL =>", `${API_BASE}/api/auth/register`);
alert(`${API_BASE}/api/auth/register`);
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // ✅ Safe JSON parsing
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert("❌ Backend not JSON (Register): " + text.substring(0, 120));
      return;
    }

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    alert("✅ Registered successfully. Now login");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
console.log("LOGIN URL =>", `${API_BASE}/api/auth/login`);
alert(`${API_BASE}/api/auth/login`);
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // ✅ Safe JSON parsing
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert("❌ Backend not JSON (Login): " + text.substring(0, 120));
      return;
    }

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("✅ Login successful!");
    window.location.href = "home.html";
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
