function getInputs() {
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!mobile || !password) {
    alert("Enter mobile and password");
    return null;
  }

  return { mobile, password };
}

async function registerUser() {
  const data = getInputs();
  if (!data) return;

  try {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Registration failed");
      return;
    }

    alert("Registered successfully. Now login.");
  } catch (err) {
    alert("Server error");
  }
}

async function login() {
  const data = getInputs();
  if (!data) return;

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Login failed");
      return;
    }

    localStorage.setItem("token", result.token);
    window.location.href = "home.html";
  } catch (err) {
    alert("Server error");
  }
}
