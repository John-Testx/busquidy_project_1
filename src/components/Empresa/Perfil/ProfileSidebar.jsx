import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, UserCircle, Shield } from 'lucide-react';

const sections = [
  { path: 'info', label: 'Info. Empresa', icon: <Building2 size={18} /> },
  { path: 'representante', label: 'Representante', icon: <UserCircle size={18} /> },
  { path: 'acceso', label: 'Acceso', icon: <Shield size={18} /> },
];

function ProfileSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section.path}>
              <NavLink
                to={section.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full p-3 my-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#07767c] to-[#055a5f] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#07767c]'
                  }`
                }
              >
                {section.icon}
                <span>{section.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default ProfileSidebar;