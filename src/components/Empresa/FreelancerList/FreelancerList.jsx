import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import MessageModal from "@/components/MessageModal";
import useFreelancers from "@/hooks/useFreelancers";

function FreelancerList({ userType, id_usuario }) {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Custom hook para gestionar freelancers
    const {
        freelancers,
        loading,
        error,
        profileWarning,
        applyFilters
    } = useFreelancers({ userType, id_usuario });

    // Mostrar advertencia de perfil incompleto si existe
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

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <SearchFilters onFilterChange={handleFilterChange} />
                <div className="flex-1 flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[#07767c] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Cargando freelancers...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar mensaje de error
    if (error) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <SearchFilters onFilterChange={handleFilterChange} />
                <div className="flex-1 flex items-center justify-center py-16">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                        <div className="flex items-center gap-3 mb-2">
                            <svg 
                                className="w-6 h-6 text-red-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <h3 className="text-red-800 font-semibold">Error al cargar</h3>
                        </div>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Search Filters Sidebar */}
            <SearchFilters onFilterChange={handleFilterChange} />
            
            {/* Freelancer Cards Container */}
            <div className="flex-1 max-h-[900px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {freelancers.length > 0 ? (
                        freelancers.map((freelancer) => (
                            <div 
                                key={freelancer.id} 
                                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#07767c]/30 hover:-translate-y-2"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-br from-gray-50 to-white p-5 border-b border-gray-100">
                                    <div className="flex items-start gap-4">
                                        {/* Profile Image */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src="https://via.placeholder.com/100"
                                                alt="Freelancer"
                                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        
                                        {/* Freelancer Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                                {freelancer.nombre} {freelancer.apellido}
                                            </h3>
                                            
                                            {/* Location */}
                                            <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-3">
                                                <svg 
                                                    className="w-4 h-4 text-gray-400 flex-shrink-0" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                                                    />
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                                                    />
                                                </svg>
                                                <span className="truncate">{freelancer.ubicacion}</span>
                                            </div>
                                            
                                            {/* Ratings and Badges */}
                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                {/* Stars */}
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                                                    <span className="text-gray-600 font-medium">
                                                        ({freelancer.calificacion})
                                                    </span>
                                                </div>
                                                
                                                {/* Verified Badge */}
                                                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                                    <svg 
                                                        className="w-3 h-3" 
                                                        fill="currentColor" 
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path 
                                                            fillRule="evenodd" 
                                                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                                            clipRule="evenodd" 
                                                        />
                                                    </svg>
                                                    <span className="font-medium">Verificado</span>
                                                </div>
                                                
                                                {/* Popular Badge */}
                                                <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full">
                                                    <svg 
                                                        className="w-3 h-3" 
                                                        fill="currentColor" 
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path 
                                                            fillRule="evenodd" 
                                                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" 
                                                            clipRule="evenodd" 
                                                        />
                                                    </svg>
                                                    <span className="font-medium">Popular</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Card Body */}
                                <div className="p-5">
                                    {/* Description */}
                                    <p className="text-gray-700 text-sm leading-relaxed mb-5 line-clamp-3">
                                        {freelancer.descripcion}
                                    </p>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => verPerfilFreelancer(freelancer.id)}
                                            className="flex-1 bg-gradient-to-r from-[#07767c] to-[#0a474f] text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
                                        >
                                            Ver Perfil
                                        </button>
                                        <button 
                                            onClick={() => contactarFreelancer(freelancer.correo, freelancer.telefono)}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
                                        >
                                            Contactar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg 
                                    className="w-10 h-10 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg font-medium text-center">
                                No se encontraron freelancers que coincidan con los filtros.
                            </p>
                            <p className="text-gray-500 text-sm text-center mt-2">
                                Intenta ajustar los filtros o restablecerlos.
                            </p>
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