import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import MessageModal from "@/components/MessageModal";
import ProfileCircle from "@/components/ProfileCircle";
import { useFreelancers } from "@/hooks";
import { checkEmpresaProfileStatus } from "@/api/empresaApi";
import { createContactRequest } from "@/api/contactRequestApi";
import { 
    FaStar, 
    FaMapMarkerAlt, 
    FaCheckCircle, 
    FaFire 
} from 'react-icons/fa';
import { 
    Calendar, 
    MessageSquare, 
    ChevronDown, 
    User as UserIcon, 
    Send, 
    X 
} from 'lucide-react';
import LoadingScreen from "@/components/LoadingScreen";

function FreelancerList({ userType, id_usuario }) {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [isPerfilIncompleto, setIsPerfilIncompleto] = useState(null);
    const [checkingProfile, setCheckingProfile] = useState(true);
    
    // Estados para el dropdown y modal
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedFreelancer, setSelectedFreelancer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        mensaje_solicitud: '',
        fecha_entrevista_sugerida: ''
    });
    
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const {
        freelancers,
        loading: freelancersLoading,
        error,
        profileWarning,
        applyFilters
    } = useFreelancers({ userType, id_usuario });

    // Verificar perfil de empresa al montar
    useEffect(() => {
        const checkProfile = async () => {
            if (userType === 'empresa' || userType === 'empresa_juridico' || userType === 'empresa_natural') {
                if (id_usuario) {
                    try {
                        const statusData = await checkEmpresaProfileStatus(id_usuario);
                        setIsPerfilIncompleto(statusData.isPerfilIncompleto);
                    } catch (err) {
                        console.error("Error verificando perfil:", err);
                        setIsPerfilIncompleto(true);
                    }
                }
            } else {
                setIsPerfilIncompleto(false);
            }
            setCheckingProfile(false);
        };
        checkProfile();
    }, [userType, id_usuario]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
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

    React.useEffect(() => {
        if (profileWarning) {
            setMessage(profileWarning);
            setShowMessageModal(true);
        }
    }, [profileWarning]);

    /**
     * Verificar si puede contactar (perfil completo)
     */
    const canContact = () => {
        if (userType === 'empresa' || userType === 'empresa_juridico' || userType === 'empresa_natural') {
            if (isPerfilIncompleto) {
                setMessage('Debes completar tu perfil de empresa antes de contactar freelancers.');
                setShowMessageModal(true);
                return false;
            }
            return true;
        } else if (userType === 'freelancer') {
            setMessage('Esta función es exclusiva para usuarios de tipo empresa.');
            setShowMessageModal(true);
            return false;
        } else {
            setMessage('Debes iniciar sesión como empresa para desbloquear esta función.');
            setShowMessageModal(true);
            return false;
        }
    };

    /**
     * Ver perfil del freelancer
     */
    const verPerfilFreelancer = (idFreelancer) => {
        if (!canContact()) return;
        navigate(`/viewfreelancer/${idFreelancer}`);
    };

    /**
     * Abrir modal de contacto
     */
    const handleOpenModal = (type, freelancer) => {
        if (!canContact()) return;
        setModalType(type);
        setSelectedFreelancer(freelancer);
        setIsModalOpen(true);
        setOpenDropdownId(null);
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
        
        if (!selectedFreelancer?.id) {
            setErrorMessage('Error: No se encontró el ID del freelancer');
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
                id_freelancer: selectedFreelancer.id,
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
                setSelectedFreelancer(null);
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

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    const handleFilterChange = (filters) => {
        applyFilters(filters);
    };

    if (freelancersLoading || checkingProfile) return <LoadingScreen />;

    if (error) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <SearchFilters onFilterChange={handleFilterChange} />
                <div className="flex-1 flex items-center justify-center py-20">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-red-800 mb-2">Error al cargar</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <SearchFilters onFilterChange={handleFilterChange} />
                
                <div className="flex-1">
                    {/* Results header */}
                    {freelancers.length > 0 && (
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    Freelancers Disponibles
                                </h2>
                                <p className="text-gray-600">
                                    <span className="font-bold text-[#07767c]">{freelancers.length}</span> profesionales encontrados
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Freelancer Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {freelancers.length > 0 ? (
                            freelancers.map((freelancer) => {
                                const userInitials = freelancer.nombre 
                                    ? `${freelancer.nombre.charAt(0)}${freelancer.apellido?.charAt(0) || ''}`.toUpperCase()
                                    : 'NN';

                                return (
                                    <div 
                                        key={freelancer.id} 
                                        className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-[#07767c]/30 hover:-translate-y-2 flex flex-col"
                                        style={{ overflow: 'visible' }}
                                    >
                                        {/* Card Header con imagen de perfil - MÁS BAJO */}
                                        <div className="relative h-24 bg-gradient-to-br from-[#07767c] to-[#40E0D0] rounded-t-2xl overflow-hidden">
                                            <div className="absolute -bottom-10 left-6">
                                                <div className="relative">
                                                    <ProfileCircle userInitials={userInitials} size="lg" />
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Badges en header */}
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <div className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                                    <FaCheckCircle className="text-white text-xs" />
                                                    <span className="text-white font-bold text-xs">Verificado</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Card Body - MENOS PADDING */}
                                        <div className="pt-12 px-5 pb-5 flex-1 flex flex-col">
                                            {/* Nombre y ubicación - MÁS COMPACTO */}
                                            <div className="mb-3">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-[#07767c] transition-colors">
                                                    {freelancer.nombre} {freelancer.apellido}
                                                </h3>
                                                
                                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                                    <FaMapMarkerAlt className="text-[#07767c] flex-shrink-0" />
                                                    <span className="truncate">{freelancer.ubicacion}</span>
                                                </div>
                                                
                                                {/* Rating */}
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-lg">
                                                        <FaStar className="text-yellow-500 text-xs" />
                                                        <span className="font-bold text-gray-900 text-xs">{freelancer.calificacion}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-lg">
                                                        <FaFire className="text-red-500 text-xs" />
                                                        <span className="font-bold text-gray-900 text-xs">Popular</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Description - MÁS CORTA */}
                                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                                                {freelancer.descripcion}
                                            </p>

                                            {/* Mensajes de éxito/error - MÁS COMPACTOS */}
                                            {successMessage && selectedFreelancer?.id === freelancer.id && (
                                                <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                                    <p className="text-xs text-green-700">{successMessage}</p>
                                                </div>
                                            )}
                                            {errorMessage && selectedFreelancer?.id === freelancer.id && (
                                                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-xs text-red-700">{errorMessage}</p>
                                                </div>
                                            )}
                                            
                                            {/* ✅ BOTONES AJUSTADOS AL ANCHO DE LA TARJETA */}
                                            <div className="flex gap-2 relative z-10">
                                                {/* Botón Ver Perfil - AJUSTADO */}
                                                <button 
                                                    onClick={() => verPerfilFreelancer(freelancer.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-3 rounded-xl transition-all duration-200"
                                                >
                                                    <UserIcon size={16} />
                                                    <span className="text-xs whitespace-nowrap">Ver Perfil</span>
                                                </button>

                                                {/* Dropdown Contactar - AJUSTADO */}
                                                <div 
                                                    className="relative flex-1" 
                                                    ref={openDropdownId === freelancer.id ? dropdownRef : null}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            if (canContact()) {
                                                                setOpenDropdownId(openDropdownId === freelancer.id ? null : freelancer.id);
                                                            }
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <span className="text-xs whitespace-nowrap">Contactar</span>
                                                        <ChevronDown 
                                                            size={14} 
                                                            className={`transition-transform duration-200 ${openDropdownId === freelancer.id ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    {/* ✅ DROPDOWN MENU - MÁS ANCHO QUE EL BOTÓN */}
                                                    {openDropdownId === freelancer.id && (
                                                        <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 w-[280px]">
                                                            {/* Opción 1: Entrevista Online */}
                                                            <button
                                                                onClick={() => handleOpenModal('entrevista', freelancer)}
                                                                className="w-full flex items-start gap-3.5 px-4 py-3.5 text-left text-gray-700 hover:bg-[#07767c]/5 transition-colors border-b border-gray-100 rounded-t-xl"
                                                            >
                                                                <Calendar size={19} className="flex-shrink-0 text-[#07767c] mt-0.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-semibold text-sm text-gray-900 mb-0.5">
                                                                        Solicitar entrevista online
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 leading-relaxed">
                                                                        Agendar videollamada
                                                                    </div>
                                                                </div>
                                                            </button>

                                                            {/* Opción 2: Mensajería Interna */}
                                                            <button
                                                                onClick={() => handleOpenModal('chat', freelancer)}
                                                                className="w-full flex items-start gap-3.5 px-4 py-3.5 text-left text-gray-700 hover:bg-[#07767c]/5 transition-colors rounded-b-xl"
                                                            >
                                                                <MessageSquare size={19} className="flex-shrink-0 text-[#07767c] mt-0.5" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-semibold text-sm text-gray-900 mb-0.5">
                                                                        Solicitar mensajería interna
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 leading-relaxed">
                                                                        Iniciar conversación
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron freelancers</h3>
                                <p className="text-gray-600 text-center max-w-md mb-6">
                                    No hay freelancers que coincidan con los filtros actuales
                                </p>
                                <button 
                                    onClick={() => handleFilterChange({ search: "", location: "", rating: null, skills: "" })}
                                    className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
                                >
                                    Restablecer filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Mensaje Simple */}
            {showMessageModal && (
                <MessageModal message={message} closeModal={closeMessageModal} />
            )}

            {/* Modal de Solicitud de Contacto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
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
}

export default FreelancerList;