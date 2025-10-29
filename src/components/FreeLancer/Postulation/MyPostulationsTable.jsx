import React, { useState } from 'react';
import { usePostulations } from '@/hooks';
import { Briefcase } from 'lucide-react';
import CancelPostulationModal from './CancelPostulationModal';
import ViewPostulationModal from './ViewPostulationModal';
import PostulationItem from './PostulationItem';

const MyPostulationsTable = ({ id_usuario }) => {
    const {
        postulations,
        loading,
        currentPage,
        sortOption,
        calculateTimeAgo,
        removePostulation,
        handlePageChange,
        handleSortChange,
        getCurrentPagePostulations,
        getTotalPages
    } = usePostulations(id_usuario);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPostulation, setSelectedPostulation] = useState(null);

    /**
     * Abre el modal de confirmación de cancelación
     */
    const handleOpenCancelModal = (postulation) => {
        setSelectedPostulation(postulation);
        setShowCancelModal(true);
    };

    /**
     * Cierra el modal de confirmación de cancelación
     */
    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setSelectedPostulation(null);
    };

    /**
     * Abre el modal de visualización
     */
    const handleOpenViewModal = (postulation) => {
        setSelectedPostulation(postulation);
        setShowViewModal(true);
    };

    /**
     * Cierra el modal de visualización
     */
    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedPostulation(null);
    };

    /**
     * Maneja la cancelación de la postulación
     */
    const handleConfirmCancel = async (id_postulacion) => {
        await removePostulation(id_postulacion);
        handleCloseCancelModal();
    };

    /**
     * Maneja el contacto con la empresa (redirige al chat)
     */
    const handleContactCompany = () => {
        // Aquí deberías implementar la lógica para abrir el chat
        // Por ejemplo: navigate(`/chat/${selectedPostulation.id_empresa}`);
        console.log('Contactar empresa:', selectedPostulation.id_empresa);
        alert('Redirigiendo al chat con la empresa...');
    };

    const currentPostulations = getCurrentPagePostulations();
    const totalPages = getTotalPages();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-[#056166] to-[#078b91] p-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">
                                Mis Postulaciones
                            </h1>
                        </div>
                        <p className="text-white/80 ml-16">
                            Gestiona y realiza seguimiento a tus postulaciones activas
                        </p>
                    </div>

                    {/* Controles */}
                    <div className="p-6 bg-gray-50/50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* Sort */}
                            <div className="flex items-center gap-3">
                                <label htmlFor="sort" className="text-sm font-semibold text-gray-700">
                                    Ordenar por:
                                </label>
                                <select 
                                    id="sort" 
                                    value={sortOption} 
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#078b91] focus:border-[#078b91] bg-white transition-all duration-200 hover:border-gray-400"
                                >
                                    <option value="Estado">Estado</option>
                                    <option value="Fecha">Fecha</option>
                                    <option value="Empresa">Empresa</option>
                                </select>
                            </div>

                            {/* Paginación */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-[#078b91] hover:text-white hover:border-[#078b91] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all duration-200"
                                >
                                    Anterior
                                </button>
                                <div className="px-5 py-2.5 bg-[#078b91] text-white rounded-xl font-bold text-sm">
                                    {currentPage} / {totalPages}
                                </div>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-[#078b91] hover:text-white hover:border-[#078b91] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-300 transition-all duration-200"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Postulaciones */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 px-4">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#078b91] border-t-transparent absolute top-0 left-0"></div>
                            </div>
                            <p className="text-gray-600 text-lg font-semibold mt-6">Cargando postulaciones...</p>
                        </div>
                    ) : postulations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                                <Briefcase className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-700 text-xl font-bold">No tienes postulaciones aún</p>
                            <p className="text-gray-500 text-base mt-2 text-center max-w-md">
                                Comienza a postular a proyectos que te interesen y gestiónalos desde aquí
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {currentPostulations.map((postulation) => (
                                <PostulationItem
                                    key={postulation.id_postulacion}
                                    postulation={postulation}
                                    onView={() => handleOpenViewModal(postulation)}
                                    onCancel={() => handleOpenCancelModal(postulation)}
                                    calculateTimeAgo={calculateTimeAgo}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modales */}
            <ViewPostulationModal
                isOpen={showViewModal}
                onClose={handleCloseViewModal}
                postulation={selectedPostulation}
                onContact={handleContactCompany}
            />

            <CancelPostulationModal
                isOpen={showCancelModal}
                onClose={handleCloseCancelModal}
                postulation={selectedPostulation}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default MyPostulationsTable;