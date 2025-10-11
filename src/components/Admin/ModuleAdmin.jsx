import React from "react";
import { Link } from "react-router-dom";
import '../../styles/Admin/ModuleAdmin.css';

function ModuleAdmin({ permissions = [] }) {
  const modules = [
    { title: 'Gestión de Usuarios', route: '/usermanagement', perm: 'ver_usuarios' },
    { title: 'Gestión de Proyectos', route: '/projectmanagement', perm: 'ver_proyectos' },
    { title: 'Reseñas y Calificaciones', route: '/reviewmanagement', perm: 'gestionar_resenas' },
    { title: 'Soporte y Moderación', route: '/supportmanagement', perm: 'gestionar_soporte' },
    { title: 'Pagos y Transacciones', route: '/paymentmanagement', perm: 'gestionar_pagos' },
    { title: 'Anuncios y Notificaciones', route: '/notificationmanagement', perm: 'gestionar_anuncios' },
    { title: 'Auditoría y Seguridad', route: '/auditandsecurity', perm: 'auditoria' },
  ];

  const filteredModules = modules.filter(m => 
    permissions.includes(m.perm) || permissions.includes('ALL_ACCESS')
  );

  return (
    <div className="module-container">
      <h2>Módulos de Administración</h2>
      <div className="modules-grid">
        {filteredModules.map((module, index) => (
          <Link key={index} to={module.route} className="module-card">
            <h3>{module.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ModuleAdmin;
