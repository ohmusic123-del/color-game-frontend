/* =========================
   API CONFIG
========================= */

/* 🔗 BACKEND URL */
const API = "https://color-game-backend1.onrender.com";

/* =========================
   TOKENS
========================= */
const token = localStorage.getItem("token");
const adminToken = localStorage.getItem("adminToken");

/* =========================
   HEADERS
========================= */
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: token
  };
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: adminToken
  };
}

/* =========================
   AUTH HELPERS
========================= */
function requireLogin() {
  if (!token) {
    window.location.href = "index.html";
  }
}

function requireAdmin() {
  if (!adminToken) {
    window.location.href = "admin-login.html";
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

function adminLogout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}
