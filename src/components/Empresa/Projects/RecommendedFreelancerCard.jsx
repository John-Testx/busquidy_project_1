import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronDown, User as UserIcon, Briefcase, Star, MapPin } from 'lucide-react';
import ProfileCircle from '@/components/ProfileCircle';
import { createContactRequest } from '@/api/contactRequestApi'; // Importamos la API real
import InterviewRequestModal from './InterviewRequestModal'; // Reutilizamos el modal

const RecommendedFreelancerCard = ({ freelancer, projectId }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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

    // Limpiar mensajes
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

    // ✅ LÓGICA REAL PARA SOLICITAR CHAT (Copiada y adaptada de PostulationCard)
    const handleRequestChat = async () => {
        setIsDropdownOpen(false);
        setLoading(true);
        setErrorMessage('');

        try {
            // Nota: Al ser recomendación, no tenemos 'id_postulacion'.
            // Intentamos enviar id_usuario y id_proyecto para iniciar la conexión.
            const requestData = {
                id_usuario_destinatario: freelancer.id_usuario, // Usamos ID de usuario directo
                id_proyecto: projectId,
                tipo_solicitud: 'chat',
                mensaje_solicitud: `Hola ${freelancer.nombres}, te invito a conversar sobre mi proyecto.`,
                fecha_entrevista_sugerida: null
            };

            await createContactRequest(requestData);
            setSuccessMessage('✅ Solicitud de chat enviada exitosamente');

        } catch (error) {
            console.error('❌ Error al enviar solicitud de chat:', error);
            // Si falla porque requiere id_postulacion, mostramos un mensaje amigable
            setErrorMessage(
                error.response?.data?.error || 'Error al enviar solicitud. Es posible que debas invitarlo primero.'
            );
        } finally {
            setLoading(false);
        }
    };
    
    const handleInvite = () => {
        // Lógica para el botón principal "Invitar/Contratar"
        // Podría ser crear una invitación formal
        console.log("Invitar a:", freelancer.nombres);
        navigate(`/empresa/view-freelancer/${freelancer.id_usuario}`); // O abrir modal de invitación
    };

    return (
        <>
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:bg-purple-50/10 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start gap-4">
                    <ProfileCircle userInitials={userInitials} size="lg" className="bg-purple-100 text-purple-700" />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-bold text-gray-900 truncate">
                                {freelancer?.nombres} {freelancer?.apellidos}
                            </h4>
                            <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                {freelancer.ciudad || "Remoto"}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 truncate">
                            {freelancer?.titulo_profesional || freelancer?.descripcion?.substring(0, 50) || 'Freelancer Recomendado'}
                        </p>

                        <div className="flex items-center gap-1 mb-3">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-gray-700 text-sm">
                                {parseFloat(freelancer.calificacion_promedio || 0).toFixed(1)}
                            </span>
                        </div>

                        {/* Mensajes de Feedback */}
                        {successMessage && (
                            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <p className="text-sm text-red-700">{errorMessage}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleVerPerfil}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                            >
                                <UserIcon size={16} />
                                Ver Perfil
                            </button>

                            <button
                                onClick={handleInvite}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                            >
                                <Briefcase size={16} />
                                Invitar
                            </button>

                            {/* DROPDOWN CONTACTAR */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    disabled={loading}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md border border-gray-200 ${
                                        loading 
                                            ? 'bg-gray-100 text-gray-400 cursor-wait' 
                                            : 'bg-white hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    {loading ? 'Procesando...' : 'Contactar'}
                                    <ChevronDown 
                                        size={16} 
                                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
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
                </div>
            </div>

            {/* MODAL DE ENTREVISTA (Reutilizado) */}
            {/* Nota: Adaptamos 'postulant' para pasarle el id_usuario del freelancer */}
            <InterviewRequestModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                postulant={{ ...freelancer, id_postulacion: null }} // Pasamos null si no hay postulación
            />
        </>
    );
};

export default RecommendedFreelancerCard;