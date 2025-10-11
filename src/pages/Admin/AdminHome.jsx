import React, { useState } from "react";
import SidebarAdmin from "../../components/Admin/SidebarAdmin";
import Dashboard from "../../components/Admin/Dashboard";
import ModuleAdmin from "../../components/Admin/ModuleAdmin";
import SupportTable from "../../components/Admin/SupportTable";
import useAuth from "../../hooks/useAuth";
import { useAdminPermissions } from "../../api/useAdminPermissions";
import AuditAndSecurityTable from "../../components/Admin/AuditAndSecurityTable";
import UserManagement from "./UserManagement";
import PaymentManagement from "./PaymentManagement";
import NotificationManegement from "./NotificationManegement";

export default function AdminHome({ connectedUsers }) {
  const { id_usuario } = useAuth();
  const { permissions, loading } = useAdminPermissions(id_usuario);
  const [activeModule, setActiveModule] = useState("dashboard"); // 🔹 track current section

  if (loading) return <div>Cargando permisos...</div>;

  const renderModule = () => {
    switch (activeModule) {
        case "dashboard":
            return <Dashboard connectedUsers={connectedUsers} />;
        case "usermanagement":
            return <UserManagement />;
        case "audit":
            return <AuditAndSecurityTable />;
        case "paymentmanagement":
            return <PaymentManagement />;
        case "support":
            return <SupportTable />;
        case "notificationmanagement":
            return <NotificationManegement />;
        default:
            return <Dashboard connectedUsers={connectedUsers} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin setActiveModule={setActiveModule} activeModule={activeModule} />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto transition-all duration-300">
        {renderModule()}
      </main>
    </div>
  );
}
