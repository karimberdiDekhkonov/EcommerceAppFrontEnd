import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles")) || [];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
