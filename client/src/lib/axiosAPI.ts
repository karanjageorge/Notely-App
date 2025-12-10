// src/lib/axiosAPI.ts
import axios from "axios";
import { useAuthStore } from "../lib/store"; // adjust path if necessary

const api = axios.create({
  baseURL: "http://localhost:5001", // <- ensure this matches your backend
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // read token safely from store.getState to avoid render-time hooks
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
