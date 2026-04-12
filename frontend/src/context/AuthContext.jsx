import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/users/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    const interceptorId = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptorId);
    };
  }, []);

  const login = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const logout = () => {
    setUser(null);
    window.location.href = "http://localhost:8081/logout";
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchMe, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API as authAPI };