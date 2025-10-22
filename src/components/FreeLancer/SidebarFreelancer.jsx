import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaClipboardList, FaCalendarAlt } from 'react-icons/fa'; // Íconos para un look más pro

const SidebarFreelancer = () => {
  const menuItems = [
    //{ path: "/freelancer-profile", name: "Panel Principal", icon: <FaTachometerAlt /> },
    { path: "/freelancer-profile/view-profile", name: "Mi Perfil / CV", icon: <FaUser /> },
    { path: "/freelancer-profile/my-postulations", name: "Mis Postulaciones", icon: <FaClipboardList /> },
    { path: "/freelancer-profile/availability", name: "Mi Horario/Disponibilidad", icon: <FaCalendarAlt /> },
  ];

  const linkClasses = "flex items-center p-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200";
  const activeLinkClasses = "bg-[#055a5f] text-white";

  return (
    // 'lg:block' la hace visible en pantallas grandes, 'hidden' la oculta en móviles.
    <aside className="w-64 bg-gray-800 text-white flex-col fixed top-20 left-0 h-[calc(100vh-5rem)] hidden lg:flex">
      <div className="mt-6 p-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-center">Opciones Freelancer</h3>
      </div>
      <nav className="flex-grow mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/freelancer"}
            className={({ isActive }) =>
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarFreelancer;