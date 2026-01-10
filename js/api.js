/* =========================
   BIGWIN API CONFIG
========================= */

/**
 * ⚠️ CHANGE ONLY IF BACKEND URL CHANGES
 */
const API = "https://color-game-backend1.onrender.com";

/**
 * USER TOKEN
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * ADMIN TOKEN
 */
function getAdminToken() {
  return localStorage.getItem("adminToken");
}

/**
 * COMMON HEADERS (USER)
 */
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: getToken()
  };
}

/**
 * COMMON HEADERS (ADMIN)
 */
function adminHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: getAdminToken()
  };
}
