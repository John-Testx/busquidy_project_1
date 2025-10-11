import React, { useState } from "react";
import { Menu, X, LayoutDashboard, Users, FileText, MessageSquare, CreditCard, Bell, Shield } from "lucide-react";

export default function SidebarAdmin({ setActiveModule, activeModule }) {
  const [open, setOpen] = useState(false);

  const modules = [
    { id: "dashboard", title: "Panel", icon: <LayoutDashboard size={20} /> },
    { id: "usermanagement", title: "Gestión de Usuarios", icon: <Users size={20} /> },
    { id: "support", title: "Soporte", icon: <MessageSquare size={20} /> },
    { id: "paymentmanagement", title: "Pagos", icon: <CreditCard size={20} /> },
    { id: "notificationmanagement", title: "Notificaciones", icon: <Bell size={20} /> },
    { id: "audit", title: "Auditoría", icon: <Shield size={20} /> },
  ];

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b">
        <h1 className="text-lg font-bold text-gray-800">Panel Admin</h1>
        <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-gray-900">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto bg-white shadow-lg border-r transform md:translate-x-0 transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full w-64">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Busquidy Admin</h2>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {modules.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left
                ${
                  activeModule === item.id
                    ? "bg-indigo-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
