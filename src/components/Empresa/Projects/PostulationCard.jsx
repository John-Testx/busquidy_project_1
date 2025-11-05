import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronDown, User as UserIcon, Briefcase } from 'lucide-react';
import ProfileCircle from '@/components/ProfileCircle';
import { createContactRequest } from '@/api/contactRequestApi';
import { hireFreelancer } from '@/api/postulationApi';
import InterviewRequestModal from './InterviewRequestModal';

const PostulationCard = ({ postulant, onPostulantUpdate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hiringLoading, setHiringLoading] = useState(false); // ✅ NUEVO
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const haySolicitudPendiente = postulant?.solicitud_pendiente === true;
    const estaContratado = postulant?.estado_postulacion === 'aceptada' || postulant?.estado_postulacion === 'en proceso';

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

    // Limpiar mensajes después de 5 segundos
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const userInitials = postulant?.nombre 
        ? postulant.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'NN';

    const handleVerPerfil = () => {
        if (postulant?.id_usuario) {
            navigate(`/viewfreelancer/${postulant.id_usuario}`);
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
                id_postulacion: postulant.id_postulacion,
                tipo_solicitud: 'chat',
                mensaje_solicitud: null,
                fecha_entrevista_sugerida: null
            };

            await createContactRequest(requestData);
            setSuccessMessage('✅ Solicitud de chat enviada exitosamente');

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            console.error('❌ Error al enviar solicitud de chat:', error);
            setErrorMessage(
                error.response?.data?.error || 'Error al enviar la solicitud de chat'
            );
        } finally {
            setLoading(false);
        }
    };

    // ✅ NUEVA FUNCIÓN: Contratar freelancer
    const handleHireFreelancer = async () => {
        if (!window.confirm(`¿Estás seguro de que deseas contratar a ${postulant.nombre}?`)) {
            return;
        }

        setHiringLoading(true);
        setErrorMessage('');

        try {
            const response = await hireFreelancer(postulant.id_postulacion);
            setSuccessMessage('✅ Freelancer contratado exitosamente. Ya pueden chatear.');

            // Opcional: Redirigir al chat después de 2 segundos
            if (response.id_conversation) {
                setTimeout(() => {
                    navigate(`/chat/${response.id_conversation}`);
                }, 2000);
            }

            // Notificar al componente padre para actualizar la lista (opcional)
            if (onPostulantUpdate) {
                onPostulantUpdate();
            }

        } catch (error) {
            console.error('❌ Error al contratar freelancer:', error);
            setErrorMessage(
                error.response?.data?.error || 'Error al contratar al freelancer'
            );
        } finally {
            setHiringLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#07767c]/30 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start gap-4">
                    <ProfileCircle userInitials={userInitials} size="lg" />

                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 truncate">
                            {postulant?.nombre || 'Usuario Anónimo'}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 truncate">
                            {postulant?.titulo_profesional || 'Sin título especificado'}
                        </p>

                        {/* ✅ BADGE DE ESTADO CONTRATADO */}
                        {estaContratado && (
                            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700 flex items-center gap-2">
                                    <span>✅</span>
                                    Freelancer contratado
                                </p>
                            </div>
                        )}

                        {haySolicitudPendiente && !estaContratado && (
                            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-700 flex items-center gap-2">
                                    <span>⏳</span>
                                    Solicitud de contacto pendiente
                                </p>
                            </div>
                        )}

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

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleVerPerfil}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                            >
                                <UserIcon size={16} />
                                Ver Perfil
                            </button>

                            {/* ✅ BOTÓN CONTRATAR */}
                            {!estaContratado && (
                                <button
                                    onClick={handleHireFreelancer}
                                    disabled={hiringLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {hiringLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Contratando...
                                        </>
                                    ) : (
                                        <>
                                            <Briefcase size={16} />
                                            Contratar
                                        </>
                                    )}
                                </button>
                            )}

                            {/* BOTÓN CONTACTAR (deshabilitado si ya está contratado o hay solicitud pendiente) */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => !haySolicitudPendiente && !estaContratado && setIsDropdownOpen(!isDropdownOpen)}
                                    disabled={haySolicitudPendiente || loading || estaContratado}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md ${
                                        haySolicitudPendiente || loading || estaContratado
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white hover:shadow-lg'
                                    }`}
                                >
                                    {estaContratado 
                                        ? 'Ya Contratado' 
                                        : haySolicitudPendiente 
                                        ? 'Solicitud Enviada' 
                                        : 'Contactar'}
                                    {!haySolicitudPendiente && !loading && !estaContratado && (
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </button>

                                {isDropdownOpen && !haySolicitudPendiente && !estaContratado && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={handleOpenInterviewModal}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-[#07767c]/5 transition-colors border-b border-gray-100"
                                        >
                                            <Calendar size={18} className="flex-shrink-0 text-[#07767c]" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">Solicitud de entrevista online</div>
                                                <div className="text-xs text-gray-500">Agendar una videollamada</div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={handleRequestChat}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-[#07767c]/5 transition-colors"
                                        >
                                            <MessageSquare size={18} className="flex-shrink-0 text-[#07767c]" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">Solicitud de mensajería interna</div>
                                                <div className="text-xs text-gray-500">Iniciar conversación</div>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE ENTREVISTA */}
            <InterviewRequestModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                postulant={postulant}
            />
        </>
    );
};

export default PostulationCard;