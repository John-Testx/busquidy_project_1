import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import useAuth from "../../hooks/useAuth";
import { useAdminPermissions } from "../../hooks/useAdminPermissions";

export default function AdminHome() {
  const { id_usuario } = useAuth();
  const { permissions, loading } = useAdminPermissions(id_usuario);

  if (loading) return <div>Cargando permisos...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto transition-all duration-300">
        <Outlet /> {/* 👈 Here the child route content will be rendered */}
      </main>
    </div>
  );
}
