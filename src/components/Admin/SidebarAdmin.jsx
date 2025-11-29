import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  FileCheck,
  LayoutDashboard,
  Users,
  MessageSquare,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  AlertTriangle, // <- IMPORTAR ESTE ÍCONO
} from "lucide-react";

export default function SidebarAdmin() {
  const [open, setOpen] = useState(false);

  const modules = [
    { 
      id: "dashboard", 
      title: "Panel", 
      icon: <LayoutDashboard size={20} />, 
      path: "/adminhome/dashboard" 
    },
    { 
      id: "usermanagement", 
      title: "Gestión de Usuarios", 
      icon: <Users size={20} />, 
      path: "/adminhome/usermanagement" 
    },
    { 
      id: "verificaciones", 
      title: "Verificación de Documentos", 
      icon: <FileCheck size={20} />,  
      path: "/adminhome/verificaciones" 
    },
    { 
      id: "busquidymentaltest", 
      title: "Test Mental Busquidy", 
      icon: <FileCheck size={20} />,  
      path: "/adminhome/busquidy-test" 
    },
    { 
      id: "support", 
      title: "Soporte", 
      icon: <MessageSquare size={20} />, 
      path: "/adminhome/supportmanagement" 
    },
    // ✅ NUEVO MÓDULO AGREGADO
    { 
      id: "disputes", 
      title: "Disputas y Reembolsos", 
      icon: <AlertTriangle size={20} />, 
      path: "/adminhome/disputes" 
    },
    { 
      id: "paymentmanagement", 
      title: "Pagos", 
      icon: <CreditCard size={20} />, 
      path: "/adminhome/paymentmanagement" 
    },
    { 
      id: "notificationmanagement", 
      title: "Notificaciones", 
      icon: <Bell size={20} />, 
      path: "/adminhome/notificationmanagement" 
    },
    { 
      id: "audit", 
      title: "Auditoría", 
      icon: <Shield size={20} />, 
      path: "/adminhome/auditandsecurity" 
    },
  ];

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-4 border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800">Panel Admin</h1>
        </div>
        <button 
          onClick={() => setOpen(!open)} 
          className="text-gray-600 hover:text-[#07767c] transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen bg-white shadow-xl border-r border-gray-200 transform md:translate-x-0 transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Logo section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#07767c] to-[#055a5f]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#07767c] font-bold text-lg">B</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Busquidy</h2>
                <p className="text-xs text-white/80">Panel de Administración</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Menú Principal
            </p>
            {modules.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    isActive 
                      ? "bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white shadow-lg shadow-[#07767c]/20" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#07767c]"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className={({ isActive }) => 
                    `${isActive ? "text-white" : "text-gray-500 group-hover:text-[#07767c]"} transition-colors`
                  }>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                <ChevronRight 
                  size={16} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </NavLink>
            ))}
          </nav>

          {/* Logout section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                sessionStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 font-medium py-3 rounded-xl transition-all border border-red-200 hover:border-red-300 shadow-sm hover:shadow"
            >
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}