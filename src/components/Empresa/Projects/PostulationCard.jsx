import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MessageSquare, ChevronDown, User as UserIcon } from 'lucide-react';
import ProfileCircle from '@/components/ProfileCircle';

const PostulationCard = ({ postulant }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userInitials = postulant?.nombre 
        ? postulant.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'NN';

    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#07767c]/30 transition-all duration-200 hover:shadow-md">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <ProfileCircle userInitials={userInitials} size="lg" />

                {/* Info del postulante */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 truncate">
                        {postulant?.nombre || 'Usuario Anónimo'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 truncate">
                        {postulant?.titulo_profesional || 'Sin título especificado'}
                    </p>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                        {/* Botón Ver Perfil */}
                        <button
                            onClick={() => window.open(`/viewfreelancer/${postulant?.id_usuario}`, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                            <UserIcon size={16} />
                            Ver Perfil
                        </button>

                        {/* Dropdown Contactar */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                            >
                                Contactar
                                <ChevronDown 
                                    size={16} 
                                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Opción 1: Entrevista Online */}
                                    <button
                                        disabled
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 bg-gray-50 cursor-not-allowed border-b border-gray-100"
                                    >
                                        <Calendar size={18} className="flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Solicitud de entrevista online</div>
                                            <div className="text-xs text-gray-400">Próximamente disponible</div>
                                        </div>
                                    </button>

                                    {/* Opción 2: Mensajería Interna */}
                                    <button
                                        disabled
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 bg-gray-50 cursor-not-allowed"
                                    >
                                        <MessageSquare size={18} className="flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Solicitud de mensajería interna</div>
                                            <div className="text-xs text-gray-400">Próximamente disponible</div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostulationCard;