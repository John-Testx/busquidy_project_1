import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, UserCircle, CreditCard, FileText, Settings, ChevronRight } from 'lucide-react';

const sections = [
  { 
    path: 'info', 
    label: 'Información Empresa', 
    icon: <Building2 size={20} />,
    description: 'Datos corporativos'
  },
  { 
    path: 'representante', 
    label: 'Representante Legal', 
    icon: <UserCircle size={20} />,
    description: 'Contacto principal'
  },
  { 
    path: 'subscription', 
    label: 'Mi Suscripción', 
    icon: <CreditCard size={20} />,
    description: 'Gestiona tu plan'
  },
  { 
    path: 'mis-transacciones', 
    label: 'Mis Transacciones', 
    icon: <FileText size={20} />,
    description: 'Historial de pagos'
  },
  { 
    path: 'configuracion', 
    label: 'Configuración', 
    icon: <Settings size={20} />,
    description: 'Seguridad y cuenta'
  },
];

function ProfileSidebar() {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#07767c] to-[#05595d] p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Panel de Empresa</h3>
              <p className="text-white/80 text-sm">Gestiona tu perfil</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.path}>
                <NavLink
                  to={section.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-4 w-full p-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#07767c] to-[#05595d] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-[#07767c]/10'
                      }`}>
                        <span className={isActive ? 'text-white' : 'text-[#07767c]'}>
                          {section.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold mb-0.5 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {section.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {section.description}
                        </p>
                      </div>
                      <ChevronRight className={`flex-shrink-0 transition-all duration-300 ${
                        isActive ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                      }`} size={18} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}            
          </ul>
        </nav>

        {/* Footer tip */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 mb-1">Tip</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mantén actualizada la información de tu empresa para generar confianza
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProfileSidebar;