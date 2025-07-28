import React from "react";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }: { children: ReactNode; role?: string }) => {
  const auth = useAuth();
  if (!auth || !auth.user) return <Navigate to="/login" />;
  if (role && auth.user.role !== role) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;