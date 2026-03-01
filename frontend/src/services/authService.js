// src/services/authService.js
import axios from "axios";

// Base API (from Vite env)
const BASE_URL = import.meta.env.VITE_API_URL;

// Safety check (helps debugging on Vercel too)
if (!BASE_URL) {
  // Don’t crash build; just warn loudly
  console.warn("VITE_API_URL is missing. Check your .env / Vercel env vars.");
}

const API_URL = `${BASE_URL || ""}/auth`;

// ✅ Store token + user consistently
const saveAuth = ({ token, user }) => {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

// ✅ Register
export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);

  // Expected backend response: { token, user, ... }
  saveAuth(res.data);

  return res.data;
};

// ✅ Login
export const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);

  // Expected backend response: { token, user, ... }
  saveAuth(res.data);

  return res.data;
};

// ✅ Logout (clear all auth info)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ Token getter
export const getToken = () => localStorage.getItem("token");

// ✅ User getter (for: Welcome back, {name})
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

// ✅ Convenience helpers
export const isAuthenticated = () => !!getToken();
