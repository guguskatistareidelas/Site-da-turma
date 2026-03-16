// contexts/AdminContext.jsx
// Provides isAdmin state and login/logout helpers across the whole app.

import { createContext, useContext, useState, useCallback } from "react";
import api from "../hooks/useApi";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem("admin_token"));
  const [error, setError] = useState(null);

  const login = useCallback(async (password) => {
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { password });
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        setIsAdmin(true);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid password.");
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, error, setError }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
