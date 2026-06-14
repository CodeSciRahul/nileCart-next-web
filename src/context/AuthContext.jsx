"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuthInstance } from "../util/firebase.js";
import { setStoredToken, getStoredToken } from "../util/api.js";
import {
  syncBackendSession,
  fetchProfile,
  logoutFromBackend,
} from "../services/authService.js";
import { showErrorToast } from "../lib/toast.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setFirebaseUser(null);
    setStoredToken(null);
  }, []);

  const establishBackendSession = useCallback(async (firebaseToken) => {
    const data = await syncBackendSession(firebaseToken);
    setUser(data.user);
    return data.user;
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
    try {
      const authInstance = getAuthInstance();
      if (authInstance) {
        await signOut(authInstance);
      }
    } catch {
      /* already signed out */
    }
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const authInstance = getAuthInstance();

    if (!authInstance) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(authInstance, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        if (!getStoredToken()) {
          setUser(null);
          setLoading(false);
          return;
        }

        await refreshProfile();
        setLoading(false);
        return;
      }

      try {
        const token = await fbUser.getIdToken();
        await establishBackendSession(token);
      } catch (error) {
        const profile = await refreshProfile();
        if (!profile) {
          showErrorToast(
            error,
            "Unable to restore your session. Please sign in again."
          );
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [establishBackendSession, refreshProfile, clearSession]);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      loading,
      isAuthenticated: !!user,
      establishBackendSession,
      refreshProfile,
      logout,
      setUser,
    }),
    [
      user,
      firebaseUser,
      loading,
      establishBackendSession,
      refreshProfile,
      logout,
    ]
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
