import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import MessageModal from "@/components/MessageModal";
import {useFreelancers} from "@/hooks";
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaFire, FaEnvelope, FaPhone } from 'react-icons/fa';

function FreelancerList({ userType, id_usuario }) {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const {
        freelancers,
        loading,
        error,
        profileWarning,
        applyFilters
    } = useFreelancers({ userType, id_usuario });

    React.useEffect(() => {
        if (profileWarning) {
            setMessage(profileWarning);
            setShowMessageModal(true);
        }
    }, [profileWarning]);

    const contactarFreelancer = (correo, telefono) => {
        if (userType === 'empresa') {
            if (correo && telefono) {
                setMessage(`Puedes contactar a este freelancer por correo: ${correo} o por teléfono: ${telefono}`);
            } else if (correo) {
                setMessage(`Puedes contactar a este freelancer por correo: ${correo}`);
            } else if (telefono) {
                setMessage(`Puedes contactar a este freelancer por teléfono: ${telefono}`);
            } else {
                setMessage('Este freelancer no tiene datos de contacto disponibles.');
            }
            setShowMessageModal(true);
        } else if (userType === 'freelancer') {
            setMessage('Esta función es exclusiva para usuarios de tipo empresa.');
            setShowMessageModal(true);
        } else {
            setMessage('Debes iniciar sesión como empresa para desbloquear esta función.');
            setShowMessageModal(true);
        }
    };

    const verPerfilFreelancer = (idFreelancer) => {
        if (userType === 'empresa') {
            navigate(`/viewfreelancer/${idFreelancer}`);
        } else if (userType === 'freelancer') {
            setMessage('Esta función es exclusiva para usuarios de tipo empresa.');
            setShowMessageModal(true);
        } else {
            setMessage('Debes iniciar sesión como empresa para desbloquear esta función.');
            setShowMessageModal(true);
        }
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    const handleFilterChange = (filters) => {
        applyFilters(filters);
    };

    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <SearchFilters onFilterChange={handleFilterChange} />
                <div className="flex-1 flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-[#07767c] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-700 font-semibold text-lg">Buscando el mejor talento...</p>
                        <p className="text-gray-500 text-sm">Esto no tomará mucho tiempo</p>
                    </div>
                </div>
            </div>
        );
    }

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
                        freelancers.map((freelancer) => (
                            <div 
                                key={freelancer.id} 
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-[#07767c]/30 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Card Header con imagen de perfil */}
                                <div className="relative h-32 bg-gradient-to-br from-[#07767c] to-[#40E0D0]">
                                    <div className="absolute -bottom-12 left-6">
                                        <div className="relative">
                                            <img
                                                src="https://via.placeholder.com/100"
                                                alt="Freelancer"
                                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Badges en header */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                            <FaCheckCircle className="text-white text-xs" />
                                            <span className="text-white font-bold text-xs">Verificado</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Card Body */}
                                <div className="pt-14 px-6 pb-6 flex-1 flex flex-col">
                                    {/* Nombre y ubicación */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#07767c] transition-colors">
                                            {freelancer.nombre} {freelancer.apellido}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                            <FaMapMarkerAlt className="text-[#07767c] flex-shrink-0" />
                                            <span className="truncate">{freelancer.ubicacion}</span>
                                        </div>
                                        
                                        {/* Rating */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg">
                                                <FaStar className="text-yellow-500 text-sm" />
                                                <span className="font-bold text-gray-900 text-sm">{freelancer.calificacion}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg">
                                                <FaFire className="text-red-500 text-sm" />
                                                <span className="font-bold text-gray-900 text-xs">Popular</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                        {freelancer.descripcion}
                                    </p>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => verPerfilFreelancer(freelancer.id)}
                                            className="w-full bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                        >
                                            Ver Perfil Completo
                                        </button>
                                        <button 
                                            onClick={() => contactarFreelancer(freelancer.correo, freelancer.telefono)}
                                            className="w-full bg-white border-2 border-[#07767c] text-[#07767c] font-bold py-3 px-4 rounded-xl hover:bg-[#07767c] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaEnvelope className="text-sm" />
                                            Contactar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
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

            {showMessageModal && (
                <MessageModal message={message} closeModal={closeMessageModal} />
            )}
        </div>
    );
}

export default FreelancerList;