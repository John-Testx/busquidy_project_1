import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, HelpCircle, MessageCircle, LogOut , Video} from 'lucide-react';

const MobileMenu = ({ 
    isOpen, 
    setIsOpen, 
    navOptions, 
    helpDropdownOptions, 
    isAuthenticated, 
    userInitials, 
    tipo_usuario, 
    profileLinks,
    isActive, 
    onOpenLogin, 
    onOpenRegister, 
    onLogout, 
    handleRestrictedLinkClick 
}) => {
    if (!isOpen) return null;

    return (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 py-4 space-y-1">
                {navOptions.map((opt) => (
                    <Link
                        key={opt.link}
                        to={opt.link}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                            isActive(opt.link) ? 'text-[#07767c] bg-[#07767c]/10' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {opt.label}
                    </Link>
                ))}

                <div className="pt-2 border-t border-gray-100">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Ayuda</p>
                    {helpDropdownOptions.map(option => (
                        <Link 
                            key={option.link}
                            to={option.link}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                            {option.label === "Soporte al Cliente" ? <MessageSquare size={18} /> : <HelpCircle size={18} />}
                            <span>{option.label}</span>
                        </Link>
                    ))}
                </div>

                <Link to="/my-calls" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Video size={18} />
                    <span>Videollamadas</span>
                </Link>
                
                <Link to="/chat" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <MessageCircle size={18} />
                    <span>Mensajes</span>
                </Link>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                    {!isAuthenticated ? (
                        <>
                            <button
                                onClick={() => { onOpenLogin(); setIsOpen(false); }}
                                className="w-full px-4 py-3 text-sm font-semibold text-[#07767c] bg-white border-2 border-[#07767c]/30 rounded-lg hover:bg-[#07767c]/5 transition-all"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => { onOpenRegister(); setIsOpen(false); }}
                                className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#07767c] to-[#055a5f] rounded-lg shadow-md"
                            >
                                Registrarse
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-3 bg-[#07767c]/5 rounded-lg">
                                <p className="text-sm font-semibold text-gray-800">{userInitials}</p>
                                <p className="text-xs text-gray-500 capitalize">{tipo_usuario}</p>
                            </div>
                            {profileLinks.map(link => (
                                <Link 
                                    key={link.link}
                                    to={link.link}
                                    onClick={(e) => {
                                        handleRestrictedLinkClick(e, link);
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <i className={`${link.icon} text-lg`}></i>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                            <button 
                                onClick={() => { onLogout(); setIsOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Cerrar sesión</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;