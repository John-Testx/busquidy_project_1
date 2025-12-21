import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronDown, User as UserIcon, Briefcase, Star } from 'lucide-react';
import ProfileCircle from '@/components/ProfileCircle';
import { createContactRequest } from '@/api/contactRequestApi';
import { hireFreelancer } from '@/api/postulationApi';
import InterviewRequestModal from './InterviewRequestModal';

const PostulationCard = ({ postulant, onPostulantUpdate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hiringLoading, setHiringLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const haySolicitudPendiente = postulant?.solicitud_pendiente === true;
    const estaContratado = postulant?.estado_postulacion === 'aceptada' || postulant?.estado_postulacion === 'en proceso';

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

            if (onPostulantUpdate) {
                onPostulantUpdate();
            }

        } catch (error) {
            console.error('❌ Error al enviar solicitud de chat:', error);
            setErrorMessage(
                error.response?.data?.error || 'Error al enviar la solicitud de chat'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleHireFreelancer = async () => {
        if (!window.confirm(`¿Estás seguro de que deseas contratar a ${postulant.nombre}?`)) {
            return;
        }

        setHiringLoading(true);
        setErrorMessage('');

        try {
            const response = await hireFreelancer(postulant.id_postulacion);
            setSuccessMessage(`✅ ${response.message || 'Estudiante contratado exitosamente'}. Ya pueden chatear.`);

            if (response.id_conversation) {
                setTimeout(() => {
                    navigate(`/chat/${response.id_conversation}`);
                }, 2000);
            }

            if (onPostulantUpdate) {
                setTimeout(() => {
                    onPostulantUpdate();
                }, 2500);
            }

        } catch (error) {
            console.error('❌ Error al contratar a estudiante:', error);
            setErrorMessage(
                error.response?.data?.error || 'Error al contratar al estudiante'
            );
        } finally {
            setHiringLoading(false);
        }
    };

    return (
        <>
            {/* ✅ NUEVO DISEÑO (idéntico a RecommendedFreelancerCard) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:border-[#07767c]/30">
                <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {userInitials}
                    </div>

                    {/* Info básica */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                            {postulant?.nombre || 'Usuario Anónimo'}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                            {postulant?.titulo_profesional || 'Sin título especificado'}
                        </p>
                        {/* Rating (si existe) */}
                    {postulant?.calificacion_promedio && (
                        <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-gray-700">
                                {parseFloat(postulant.calificacion_promedio).toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                                ({postulant.total_resenas || 0} reseñas)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Propuesta */}
            {postulant?.propuesta && (
                <div className="mb-4 p-3 bg-gradient-to-r from-[#07767c]/5 to-transparentrounded-lg border border-[#07767c]/10">
                        <p className="text-xs text-[#07767c] font-semibold mb-1">💬 Propuesta:</p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                            {postulant.propuesta}
                        </p>
                    </div>
                )}

                {/* Badges de estado */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {postulant?.estado_postulacion && (
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            postulant.estado_postulacion === 'pendiente' 
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : postulant.estado_postulacion === 'aceptada'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                            {postulant.estado_postulacion === 'pendiente' ? '⏳ Pendiente' :
                             postulant.estado_postulacion === 'aceptada' ? '✅ Aceptada' :
                             postulant.estado_postulacion}
                        </span>
                    )}
                </div>

                {/* Mensajes de estado */}
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

                {/* Botones de acción */}
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

                    {/* Contratar */}
                    {!estaContratado ? (
                        <button
                            onClick={handleHireFreelancer}
                            disabled={hiringLoading}
                            className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg transition-all text-xs font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Contratar freelancer"
                        >
                            {hiringLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                                    <span>...</span>
                                </>
                            ) : (
                                <>
                                    <Briefcase className="w-4 h-4" />
                                    <span>Contratar</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold border-2 border-emerald-300">
                            <Briefcase className="w-4 h-4" />
                            <span>Contratado</span>
                        </div>
                    )}

                    {/* Contactar (Dropdown) */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => !haySolicitudPendiente && !estaContratado && setIsDropdownOpen(!isDropdownOpen)}
                            disabled={haySolicitudPendiente || loading || estaContratado}
                            className={`w-full flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-lg transition-all text-xs font-medium ${
                                haySolicitudPendiente || loading || estaContratado
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-purple-50 hover:bg-purple-500 hover:text-white text-purple-700'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="flex items-center gap-1">
                                {estaContratado ? 'Chat' : haySolicitudPendiente ? 'Enviado' : 'Contactar'}
                                {!haySolicitudPendiente && !loading && !estaContratado && (
                                    <ChevronDown 
                                        size={12} 
                                        className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                )}
                            </span>
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

            {/* Modal de Entrevista */}
            <InterviewRequestModal
                isOpen={isInterviewModalOpen}
                onClose={() => setIsInterviewModalOpen(false)}
                postulant={postulant}
            />
        </>
    );
};

export default PostulationCard;