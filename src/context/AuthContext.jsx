"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setStoredToken, getStoredToken } from "../util/api.js";
import {
  fetchProfile,
  logoutFromBackend,
} from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setStoredToken(null);
  }, []);

  const setSession = useCallback((data) => {
    if (data?.token) {
      setStoredToken(data.token);
    }
    if (data?.user) {
      setUser(data.user);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!getStoredToken()) return null;

    try {
      const data = await fetchProfile();
      setUser(data.user);
      return data.user;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  const logout = useCallback(async () => {
    try {
      await logoutFromBackend();
    } catch {
      /* cookie may already be cleared */
    }
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!getStoredToken()) {
        if (!cancelled) setLoading(false);
        return;
      }

      await refreshProfile();
      if (!cancelled) setLoading(false);
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      setSession,
      refreshProfile,
      logout,
      setUser,
    }),
    [user, loading, setSession, refreshProfile, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
