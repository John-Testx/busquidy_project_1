import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaClipboardList, FaCalendarAlt, FaBars, FaTimes, FaChevronRight, FaLock, FaCreditCard, FaBriefcase  } from 'react-icons/fa';
import { Settings, Receipt, FileText, Banknote, ShieldCheck } from 'lucide-react';

const SidebarFreelancer = ({ isPerfilIncompleto }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { 
      path: "/freelancer-profile/view-profile", 
      name: "Mi Perfil / CV", 
      icon: <FaUser />,
      description: "Gestiona tu información",
      requiresProfile: false
    },
    { 
      path: "/freelancer-profile/my-postulations", 
      name: "Mis Postulaciones", 
      icon: <FaClipboardList />,
      description: "Ver tus aplicaciones",
      requiresProfile: true
    },
    { 
      path: "/freelancer-profile/mis-trabajos", 
      name: "Mis Trabajos", 
      icon: <FaBriefcase  />,
      description: "Ver tus trabajos",
      requiresProfile: true
    },
    { 
      path: "/freelancer-profile/availability", 
      name: "Disponibilidad", 
      icon: <FaCalendarAlt />,
      description: "Configura tu horario",
      requiresProfile: true
    },
    { 
      path: "/freelancer-profile/subscription", 
      name: "Mi Suscripción", 
      icon: <FaCreditCard />,
      description: "Gestiona tu plan",
      requiresProfile: false
    },
    { 
      path: '/freelancer-profile/mis-transacciones', 
      name: 'Mis Transacciones', 
      icon: <Banknote />,
      description: 'Historial de pagos',
      requiresProfile: false
    },
    { 
      path: '/freelancer-profile/take-test', 
      name: 'Test Busquidy', 
      icon: <ShieldCheck />,
      description: 'Test Busquidy de compromiso y responsabilidad',
      requiresProfile: false
    },
    { 
      path: '/freelancer-profile/configuracion', 
      name: 'Configuración', 
      icon: <Settings />,
      description: 'Seguridad y cuenta',
      requiresProfile: false
    },
  ];

  const visibleMenuItems = menuItems.filter(item => {
    if (item.requiresProfile) {
      return !isPerfilIncompleto;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-24 left-4 z-50 w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] text-white rounded-xl shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300"
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 top-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-72 bg-white border-r border-gray-200 flex-col fixed top-20 left-0 h-[calc(100vh-5rem)] shadow-xl z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-[#07767c] to-[#05595d]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Panel Freelancer</h3>
              <p className="text-white/80 text-xs">Gestiona tu perfil</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-6 overflow-y-auto">
          <div className="px-4 space-y-2">
            {visibleMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
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
                      <span className={`text-lg ${isActive ? 'text-white' : 'text-[#07767c]'}`}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm mb-0.5 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                    <FaChevronRight className={`flex-shrink-0 transition-all duration-300 ${
                      isActive ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                    }`} />
                  </>
                )}
              </NavLink>
            ))}

            {/* Mensaje si el perfil está incompleto */}
            {isPerfilIncompleto && (
              <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaLock className="text-yellow-700 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-yellow-900 mb-1">Completa tu perfil</p>
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      Completa tu perfil para acceder a postulaciones y disponibilidad
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 mb-1">Consejo</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mantén tu perfil actualizado para más oportunidades
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarFreelancer;