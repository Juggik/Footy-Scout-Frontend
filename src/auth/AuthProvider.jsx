// src/auth/AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as authApi from "../api/authApi";
import { setOnUnauthorized } from "../api/client";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // refreshUser with mounted guard to avoid state updates after unmount
  const refreshUser = useCallback(async () => {
    setLoading(true);
    let mounted = true;
    try {
      const profile = await authApi.getMe();
      if (mounted) setUser(profile);
    } catch (err) {
      if (mounted) setUser(null);
    } finally {
      if (mounted) setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("logout error", err);
    } finally {
      setUser(null);
      setLoading(false);
      navigate("/sign-in", { replace: true });
    }
  }, [navigate]);

  // Register 401 handler and reuse signOut so logic is centralized
  useEffect(() => {
    setOnUnauthorized(() => {
      // reuse signOut to clear state and redirect
      try {
        signOut();
      } catch (e) {
        // fallback: ensure state cleared and redirect
        setUser(null);
        setLoading(false);
        navigate("/sign-in", { replace: true });
      }
    });
    return () => setOnUnauthorized(null);
  }, [signOut, navigate]);

  // On mount, fetch /me
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const profile = await authApi.getMe();
        if (!cancelled) setUser(profile);
      } catch (err) {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refreshUser,
      signOut,
    }),
    [user, loading, refreshUser, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

// ergonomic hook that throws if used outside provider
export function useAuth() {
  const ctx = useAuthContext();
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
