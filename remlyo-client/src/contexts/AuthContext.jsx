import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { LS_KEYS } from "../constants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem(LS_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(LS_KEYS.USER);

        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          try {
            await API.get("/api/v1/auth/verify", {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
          } catch (err) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Auth verification failed", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (userData) => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/v1/auth/register", userData);
      localStorage.setItem("signupEmail", userData.email);
      return data;
    } catch (error) {
      return error?.response?.data || { message: "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, setError) => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/v1/auth/login", credentials);
      if (data.user && data.token) {
        setUser(data.user);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem(LS_KEYS.USER, JSON.stringify(data.user));
        localStorage.setItem(LS_KEYS.AUTH_TOKEN, data.token);
        if (data.redirect) navigate(data.redirect);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const socialAuth = async (res) => {
    setLoading(true);
    try {
      const token = res._tokenResponse.idToken;
      const { data } = await API.post(`/api/v1/auth/social/${res.user.uid}`, {
        token,
      });

      if (data.user && data.token) {
        setUser(data.user);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem(LS_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(LS_KEYS.USER, JSON.stringify(data.user));
        if (data.redirect) navigate(data.redirect);
        return { success: true };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || "Social authentication failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post(
        "/api/v1/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleLogout();
      navigate("/signin");
      setLoading(false);
    }
  };
  const verifyEmailToken = async (token) => {
    setLoading(true);
    try {
      const { data } = await API.post(`/api/v1/auth/verify-email/${token}`);

      if (data.user && data.token) {
        setUser(data.user);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem(LS_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(LS_KEYS.USER, JSON.stringify(data.user));
        if (data.redirect) navigate(data.redirect);
        return data
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Email verification failed:", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(LS_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LS_KEYS.USER);
    localStorage.removeItem("signupEmail");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        verifyEmailToken,
        user,
        signup,
        login,
        logout,
        authToken,
        socialAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
