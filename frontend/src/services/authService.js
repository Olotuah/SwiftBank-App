// src/services/authService.js
import api from "../utils/api";

const saveAuth = (data) => {
  if (data?.token) localStorage.setItem("token", data.token);
  if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
};

export const register = async (payload) => {
  const res = await api.post("/auth/register", payload);
  saveAuth(res.data);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);
  saveAuth(res.data);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("token");

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const updateStoredUser = (patch) => {
  try {
    const raw = localStorage.getItem("user");
    const current = raw ? JSON.parse(raw) : {};
    const merged = { ...current, ...patch };
    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getToken();
