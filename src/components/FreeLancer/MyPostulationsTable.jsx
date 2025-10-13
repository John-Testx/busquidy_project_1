import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPostulationsTable = ({ id_usuario }) => {
    const [postulations, setPostulations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("Estado");
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchPostulations = async () => {
            if (!id_usuario || isNaN(id_usuario)) {
                console.error("ID de usuario inválido:", id_usuario);
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:3001/api/freelancer/postulaciones/${id_usuario}`);
    
                if (response.data) {
                    setPostulations(response.data);
                }
            } catch (error) {
                console.error("Error al cargar las postulaciones:", error.response || error.message);
            }
        };
        fetchPostulations();
    }, [id_usuario]);

    // Calcular tiempo transcurrido
    const calculateTimeAgo = (postDate) => {
        const postDateObj = new Date(postDate);
        const now = new Date();
        const differenceInMs = now - postDateObj;
        const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
        if (daysAgo < 1) return "Hoy";
        if (daysAgo === 1) return "Hace 1 día";
        if (daysAgo < 7) return `Hace ${daysAgo} días`;
        if (daysAgo < 30) return `Hace ${Math.floor(daysAgo / 7)} semanas`;
        return `Hace ${Math.floor(daysAgo / 30)} meses`;
    };

    // Manejo de la paginación
    const handlePageChange = (page) => {
        if (page >= 1 && page <= Math.ceil(postulations.length / itemsPerPage)) {
            setCurrentPage(page);
        }
    };

    // Manejo del ordenamiento
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Eliminar una postulación
    const handleDeletePostulation = async (id_postulacion) => {
        try {
            const response = await fetch(`http://localhost:3001/api/freelancer/delete-postulacion/${id_postulacion}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Detalles del error:", errorDetails);
                throw new Error('Error al eliminar postulacion');
            }            

            setPostulations(postulations.filter(p => p.id_postulacion !== id_postulacion));

        } catch (error) {
            console.error("Error al eliminar la postulación:", error);
        }
    };

    const currentPostulations = postulations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-t-xl shadow-md p-6 border-b-2 border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Título */}
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-[#07767c] to-[#40E0D0] rounded-full"></div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Mis Postulaciones
                            </h3>
                        </div>

                        {/* Ordenamiento y Paginación */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Sort */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    Ordenar por:
                                </label>
                                <select 
                                    id="sort" 
                                    value={sortOption} 
                                    onChange={handleSortChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent bg-white transition-all duration-200"
                                >
                                    <option value="Estado">Estado</option>
                                    <option value="Fecha">Fecha</option>
                                    <option value="Empresa">Empresa</option>
                                </select>
                            </div>

                            {/* Paginación */}
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-[#07767c] hover:text-white hover:border-[#07767c] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all duration-200"
                                >
                                    &lt;
                                </button>
                                <span className="text-sm font-medium text-gray-700 px-3">
                                    {currentPage} de {Math.ceil(postulations.length / itemsPerPage) || 1}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === Math.ceil(postulations.length / itemsPerPage)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-[#07767c] hover:text-white hover:border-[#07767c] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all duration-200"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Postulaciones */}
                <div className="bg-white rounded-b-xl shadow-md">
                    {postulations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg font-medium">No tienes postulaciones aún</p>
                            <p className="text-gray-400 text-sm mt-2">Comienza a postular a proyectos que te interesen</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {currentPostulations.map((postulation) => (
                                <div 
                                    key={postulation.id_postulacion} 
                                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Info Principal */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <img 
                                                src={postulation.imageUrl || "https://via.placeholder.com/50"} 
                                                alt="Logo Empresa" 
                                                className="w-14 h-14 rounded-lg object-cover border-2 border-gray-100 flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-gray-800 text-base truncate">
                                                    {postulation.titulo}
                                                </p>
                                                <p className="text-gray-600 text-sm truncate">
                                                    {postulation.nombre_empresa}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Fecha */}
                                        <div className="flex items-center gap-2 lg:min-w-[180px]">
                                            <div className="flex flex-col items-start lg:items-end">
                                                <p className="text-sm font-medium text-[#07767c]">
                                                    {calculateTimeAgo(postulation.fecha_publicacion)}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(postulation.fecha_publicacion).toLocaleDateString('es-CL')}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Estado */}
                                        <div className="lg:min-w-[140px]">
                                            <span 
                                                title="Estado de postulación"
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                    postulation.estado_postulacion === 'Aceptada' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : postulation.estado_postulacion === 'Rechazada'
                                                        ? 'bg-red-100 text-red-800'
                                                        : postulation.estado_postulacion === 'En revisión'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {postulation.estado_postulacion}
                                            </span>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2 lg:min-w-[100px] lg:justify-end">
                                            <button
                                                title="Ver publicación"
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#07767c] text-white hover:bg-[#05595d] transition-all duration-200 hover:scale-110"
                                            >
                                                <i className="fas fa-eye text-sm"></i>
                                            </button>
                                            <button
                                                title="Eliminar postulación"
                                                onClick={() => handleDeletePostulation(postulation.id_postulacion)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
                                            >
                                                <i className="fas fa-trash-alt text-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPostulationsTable;