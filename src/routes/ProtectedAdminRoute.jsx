import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useAdminPermissions } from "../api/useAdminPermissions";

export default function ProtectedAdminRoute({ requiredPermission }) {
  const { isAuthenticated, tipo_usuario, loading } = useAuth();
  const { permissions } = useAdminPermissions(localStorage.getItem("id_usuario")); // optional optimization

  if (loading) return <div>Cargando...</div>;

  if (!isAuthenticated || tipo_usuario !== "administrador") {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

