import { createContext, useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
