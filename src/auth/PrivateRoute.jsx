// src/auth/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    // preserve where the user wanted to go so you can redirect back after sign-in
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}
