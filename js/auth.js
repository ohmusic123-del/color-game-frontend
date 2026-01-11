const API = "https://color-game-backend1.onrender.com";

/* =====================
   REGISTER
===================== */
async function register() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!mobile || !password) {
    alert("Enter mobile and password");
    return;
  }

  try {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile: mobile,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Registration failed");
      return;
    }

    alert("Registration successful. Please login.");
  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

/* =====================
   LOGIN
===================== */
async function login() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!mobile || !password) {
    alert("Enter mobile and password");
    return;
  }

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mobile: mobile,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "home.html";
  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}
