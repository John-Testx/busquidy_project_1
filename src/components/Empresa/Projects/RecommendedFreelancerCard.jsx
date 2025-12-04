import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronDown, User as UserIcon, Briefcase, Star } from 'lucide-react';
import { createContactRequest } from '@/api/contactRequestApi';
import InterviewRequestModal from './InterviewRequestModal';

const RecommendedFreelancerCard = ({ freelancer, projectId }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const userInitials = freelancer?.nombres 
        ? freelancer.nombres.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'NN';

    const handleVerPerfil = () => {
        if (freelancer?.id_usuario) {
            navigate(`/empresa/view-freelancer/${freelancer.id_usuario}`);
        }
    };

    const handleOpenInterviewModal = () => {
        setIsInterviewModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleRequestChat = async () => {
        setIsDropdownOpen(false);
        setLoading(true);
        setErrorMessage('');

        try {
            const requestData = {
                id_usuario_destinatario: freelancer.id_usuario,
                id_proyecto: projectId,
                tipo_solicitud: 'chat',
                mensaje_solicitud: `Hola ${freelancer.nombres}, te invito a conversar sobre mi proyecto.`,
                fecha_entrevista_sugerida: null
            };

            await createContactRequest(requestData);
            setSuccessMessage('✅ Solicitud de chat enviada exitosamente');

        } catch (error) {
            console.error('❌ Error al enviar solicitud de chat:', error);
            setErrorMessage(
                error.response?.data?.error || 'Error al enviar solicitud. Es posible que debas invitarlo primero.'
            );
        } finally {
            setLoading(false);
        }
    };
    
    const handleInvite = () => {
        navigate(`/empresa/view-freelancer/${freelancer.id_usuario}`);
    };

    return (
        <>
            {/* ✅ DISEÑO IDÉNTICO A PostulationCard */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:border-[#07767c]/30">
                <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {userInitials}
                    </div>

                    {/* Info básica */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                            {freelancer?.nombres} {freelancer?.apellidos}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                            {freelancer?.titulo_profesional || 'Freelancer'}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-700">
                                {parseFloat(freelancer?.calificacion_promedio || 0).toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                                ({freelancer?.total_resenas || 0} reseñas)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                {freelancer?.descripcion && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border border-purple-100">
                        <p className="text-sm text-gray-700 line-clamp-2">
                            {freelancer.descripcion}
                        </p>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer?.ciudad && (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                            📍 {freelancer.ciudad}
                        </span>
                    )}
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                        ✨ Recomendado
                    </span>
                </div>

                {/* Mensajes */}
                {successMessage && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                )}
                
                {errorMessage && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                )}

                {/* Botones (SIN contratar, solo Ver Perfil, Invitar y Contactar) */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                    {/* Ver Perfil */}
                    <button
                        onClick={handleVerPerfil}
                        className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 bg-gray-50 hover:bg-[#07767c] hover:text-white text-gray-700 rounded-lg transition-all text-xs font-medium group"
                        title="Ver perfil completo"
                    >
                        <UserIcon className="w-4 h-4" />
                        <span>Perfil</span>
                    </button>

                    {/* Invitar */}
                    <button
                        onClick={handleInvite}
                        className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 rounded-lg transition-all text-xs font-medium group"
                        title="Invitar a postular"
                    >
                        <Briefcase className="w-4 h-4" />
                        <span>Invitar</span>
                    </button>

                    {/* Contactar (Dropdown) */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            disabled={loading}
                            className={`w-full flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all text-xs font-medium ${
                                loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-700'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="flex items-center gap-1">
                                Contactar
                                {!loading && (
                                    <ChevronDown 
                                        size={12} 
                                        className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                )}
                            </span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={handleOpenInterviewModal}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors border-b border-gray-100"
                                >
                                    <Calendar size={18} className="flex-shrink-0 text-purple-600" />
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">Agendar Entrevista</div>
                                        <div className="text-xs text-gray-500">Solicitar videollamada</div>
                                    </div>
                                </button>

                                <button
                                    onClick={handleRequestChat}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 transition-colors"
                                >
                                    <MessageSquare size={18} className="flex-shrink-0 text-purple-600" />
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">Enviar Mensaje</div>
                                        <div className="text-xs text-gray-500">Solicitar chat directo</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Entrevista */}
            <InterviewRequestModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                postulant={{ ...freelancer, id_postulacion: null }}
            />
        </>
    );
};

export default RecommendedFreelancerCard;