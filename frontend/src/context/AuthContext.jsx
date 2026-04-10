import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const logout = () => {
    window.location.href = "http://localhost:8081/logout";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);