import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Users, Shield, Lock } from "lucide-react";

function UserManagement() {
  const tabs = [
    { path: "users", label: "Usuarios", icon: Users },
    { path: "roles", label: "Roles", icon: Shield },
    { path: "permissions", label: "Permisos", icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>
          
          {/* Modern Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span>{tab.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}

export default UserManagement;