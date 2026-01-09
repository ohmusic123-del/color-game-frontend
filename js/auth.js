// frontend/js/auth.js

// Base API
// api.js must be loaded BEFORE this file
// <script src="js/api.js"></script>

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/* =========================
   LOGIN
========================= */
async function login(e) {
  e.preventDefault();

  const mobile = document.getElementById("loginMobile").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!mobile || !password) {
    alert("Please enter mobile and password");
    return;
  }

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // ✅ Save user token
    localStorage.setItem("token", data.token);

    // Redirect to home
    window.location.href = "home.html";

  } catch (err) {
    alert("Server error");
  }
}

/* =========================
   REGISTER
========================= */
async function register(e) {
  e.preventDefault();

  const mobile = document.getElementById("registerMobile").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!mobile || !password) {
    alert("Please enter mobile and password");
    return;
  }

  if (password.length < 4) {
    alert("Password must be at least 4 characters");
    return;
  }

  try {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ mobile, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    alert("Registered successfully. Please login.");
    window.location.reload();

  } catch (err) {
    alert("Server error");
  }
}

/* =========================
   AUTO ATTACH
========================= */
if (loginForm) {
  loginForm.addEventListener("submit", login);
}

if (registerForm) {
  registerForm.addEventListener("submit", register);
      }
