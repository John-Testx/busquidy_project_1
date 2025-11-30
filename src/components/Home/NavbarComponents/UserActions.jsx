import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, MessageCircle, Video } from 'lucide-react';
import ProfileCircle from "../../ProfileCircle";
import NotificationIcon from '@/components/Notifications/NotificationIcon';

const UserActions = ({ 
    isAuthenticated, 
    userInitials, 
    tipo_usuario, 
    profileLinks, 
    onOpenLogin, 
    onOpenRegister, 
    onLogout,
    handleRestrictedLinkClick 
}) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="hidden lg:flex items-center gap-3 ml-auto">
                <button
                    onClick={onOpenLogin}
                    className="px-5 py-2.5 text-sm font-semibold text-[#07767c] bg-white border-2 border-[#07767c]/30 rounded-lg hover:bg-[#07767c]/5 hover:border-[#07767c]/50 transition-all duration-300"
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={onOpenRegister}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#07767c] to-[#055a5f] rounded-lg hover:from-[#055a5f] hover:to-[#043d42] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    Registrarse
                </button>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-4">
                <Link to="/my-calls" className="p-2 text-gray-600 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors relative" title="Mis Videollamadas">
                    <Video size={20} />
                </Link>
                
                <Link to="/chat" className="p-2 text-gray-600 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors relative" title="Mensajes">
                    <MessageCircle size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <NotificationIcon />

                <div className="relative" ref={profileMenuRef}>
                    <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 group">
                        <ProfileCircle userInitials={userInitials} />
                        <ChevronDown size={16} className={`text-gray-600 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-800 truncate">{userInitials}</p>
                                <p className="text-xs text-gray-500 mt-0.5 capitalize">{tipo_usuario}</p>
                            </div>
                            <div className="py-2">
                                {profileLinks.map(link => (
                                    <Link 
                                        key={link.link}
                                        to={link.link} 
                                        onClick={(e) => {
                                            handleRestrictedLinkClick(e, link);
                                            setIsProfileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#07767c]/5 hover:text-[#07767c] transition-colors"
                                    >
                                        <i className={`${link.icon} text-lg`}></i>
                                        <span>{link.label}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-2">
                                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut size={18} />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserActions;