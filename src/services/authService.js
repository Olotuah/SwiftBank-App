// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/auth';

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const logout = () => localStorage.removeItem('token');

export const getToken = () => localStorage.getItem('token');
