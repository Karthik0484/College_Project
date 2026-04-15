// ─── Centralized API Configuration ───────────────────────────
// Uses REACT_APP_API_URL from .env, falls back to localhost for development.

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API_BASE_URL;
