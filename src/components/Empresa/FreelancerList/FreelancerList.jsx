import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchFilters from "./SearchFilters";
import MessageModal from "../../MessageModal";
import { useNavigate } from "react-router-dom";

function FreelancerList({ userType, id_usuario }) {
    const [freelancers, setFreelancers] = useState([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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

    const cargarFreelancers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/freelancer/list');
            const freelancerData = response.data.map(freelancer => ({
                id: freelancer.id_freelancer,
                nombre: freelancer.nombre,
                apellido: freelancer.apellido,
                nacionalidad: freelancer.nacionalidad,
                ubicacion: `${freelancer.ciudad || 'Sin Especificar'}, ${freelancer.comuna || 'Sin Especificar'}`,                
                correo: freelancer.correo_contacto,
                telefono: freelancer.telefono_contacto,
                calificacion: freelancer.calificacion_promedio,
                descripcion: freelancer.descripcion,
                habilidades: freelancer.habilidades || ''
            }));
            setFreelancers(freelancerData);
            setFilteredFreelancers(freelancerData);
        } catch (error) {
            console.error('Error al cargar la lista de freelancers:', error);
        }
    };

    const verificarPerfilFreelancer = async () => {
        if (userType === 'freelancer') {
            try {
                const response = await axios.get(`http://localhost:3001/api/freelancer/get/${id_usuario}`);
                if (response.data.isPerfilIncompleto) {
                    setMessage('Completa tu perfil para aparecer en la lista de freelancers.');
                    setShowMessageModal(true);
                }
            } catch (error) {
                console.error("Error al verificar el perfil del freelancer:", error);
            }
        }
    };

    const handleFilterChange = (filters) => {
        let result = [...freelancers];

        if (filters.search) {
            result = result.filter(f => 
                `${f.nombre} ${f.apellido}`.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.location) {
            result = result.filter(f => 
                f.ubicacion.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.rating) {
            result = result.filter(f => 
                Math.floor(f.calificacion) >= filters.rating
            );
        }

        if (filters.skills) {
            const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim());
            result = result.filter(f => 
                skillsArray.some(skill => 
                    f.habilidades.toLowerCase().includes(skill)
                )
            );
        }

        setFilteredFreelancers(result);
    };

    useEffect(() => {
        cargarFreelancers();
        if (id_usuario && userType === 'freelancer') {
            verificarPerfilFreelancer();
        }
    }, [id_usuario, userType]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Search Filters Sidebar */}
            <SearchFilters onFilterChange={handleFilterChange} />
            
            {/* Freelancer Cards Container */}
            <div className="flex-1 max-h-[900px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFreelancers.length > 0 ? (
                        filteredFreelancers.map((freelancer) => (
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