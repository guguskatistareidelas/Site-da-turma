// hooks/useApi.js
// Pre-configured Axios instance that attaches the admin token when present.

import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach admin token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
