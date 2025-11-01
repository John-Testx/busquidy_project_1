import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, ChevronDown, User as UserIcon, Send, X } from 'lucide-react';
import ProfileCircle from '@/components/ProfileCircle';
import { createContactRequest } from '@/api/contactRequestApi';

const PostulationCard = ({ postulant }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'chat' o 'entrevista'
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        mensaje_solicitud: '',
        fecha_entrevista_sugerida: ''
    });
    
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
            console.log('Navegando al perfil del usuario:', postulant.id_usuario);
            navigate(`/viewfreelancer/${postulant.id_usuario}`);
        } else {
            console.error('No hay id_usuario disponible en postulant:', postulant);
        }
    };

    /**
     * Abrir modal para solicitud
     */
    const handleOpenModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
        setIsDropdownOpen(false);
        setFormData({
            mensaje_solicitud: '',
            fecha_entrevista_sugerida: ''
        });
        setSuccessMessage('');
        setErrorMessage('');
    };

    /**
     * Enviar solicitud de contacto
     */
    const handleSendRequest = async (e) => {
        e.preventDefault();
        
        if (!postulant?.id_postulacion) {
            setErrorMessage('Error: No se encontró el ID de postulación');
            return;
        }

        // Validaciones
        if (modalType === 'entrevista' && !formData.fecha_entrevista_sugerida) {
            setErrorMessage('Debes seleccionar una fecha para la entrevista');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const requestData = {
                id_postulacion: postulant.id_postulacion,
                tipo_solicitud: modalType,
                mensaje_solicitud: formData.mensaje_solicitud || null,
                fecha_entrevista_sugerida: modalType === 'entrevista' ? formData.fecha_entrevista_sugerida : null
            };

            console.log('📤 Enviando solicitud de contacto:', requestData);

            const response = await createContactRequest(requestData);

            console.log('✅ Respuesta del servidor:', response);
            setSuccessMessage(
                modalType === 'chat' 
                    ? '✅ Solicitud de chat enviada exitosamente' 
                    : '✅ Solicitud de entrevista enviada exitosamente'
            );

            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccessMessage('');
            }, 2000);

        } catch (error) {
            console.error('❌ Error al enviar solicitud:', error);
            setErrorMessage(
                error.response?.data?.error || 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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

                        {/* Mensaje de éxito/error */}
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
                        <div className="flex gap-2">
                            {/* Botón Ver Perfil */}
                            <button
                                onClick={handleVerPerfil}
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
                                            onClick={() => handleOpenModal('entrevista')}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-[#07767c]/5 transition-colors border-b border-gray-100"
                                        >
                                            <Calendar size={18} className="flex-shrink-0 text-[#07767c]" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">Solicitud de entrevista online</div>
                                                <div className="text-xs text-gray-500">Agendar una videollamada</div>
                                            </div>
                                        </button>

                                        {/* Opción 2: Mensajería Interna */}
                                        <button
                                            onClick={() => handleOpenModal('chat')}
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

            {/* Modal de Solicitud */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {modalType === 'chat' ? '💬 Solicitud de Chat' : '📅 Solicitud de Entrevista'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={loading}
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSendRequest} className="space-y-4">
                            {/* Campo de fecha (solo para entrevista) */}
                            {modalType === 'entrevista' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha y hora sugerida *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.fecha_entrevista_sugerida}
                                        onChange={(e) => setFormData({ ...formData, fecha_entrevista_sugerida: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent"
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                        disabled={loading}
                                    />
                                </div>
                            )}

                            {/* Mensaje opcional */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje (opcional)
                                </label>
                                <textarea
                                    value={formData.mensaje_solicitud}
                                    onChange={(e) => setFormData({ ...formData, mensaje_solicitud: e.target.value })}
                                    placeholder="Escribe un mensaje para el freelancer..."
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#07767c] focus:border-transparent resize-none"
                                    disabled={loading}
                                />
                            </div>

                            {/* Mensajes de error en el modal */}
                            {errorMessage && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{errorMessage}</p>
                                </div>
                            )}

                            {/* Mensaje de éxito en el modal */}
                            {successMessage && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700">{successMessage}</p>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-lg hover:from-[#055a5f] hover:to-[#077d84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Enviar Solicitud
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostulationCard;