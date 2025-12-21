import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import MessageModal from "@/components/MessageModal";
import ModalCreateProject from "./ModalCreateProject";
import ModalPublicarProyecto from "./ModalPublicarProyecto";
import ProjectCard from "./ProjectCard";
import ConfirmModal from "./ConfirmModal";
import ReleasePaymentModal from "./ReleasePaymentModal";
import { useCompanyProjects } from "@/hooks";
import { releaseProjectPayment } from "@/api/projectsApi";

function ViewProjects({ userType, id_usuario, terminologia, tipoParaBackend }) {
    // Estados del componente
    const [showModalProject, setShowModalProject] = useState(false);
    const [showModalPublicar, setShowModalPublicar] = useState(false);
    const [projectToPublishData, setProjectToPublishData] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [releaseModalOpen, setReleaseModalOpen] = useState(false);
    const [projectToRelease, setProjectToRelease] = useState(null);
    const [sortOption, setSortOption] = useState('Fecha');
    const [currentPage, setCurrentPage] = useState(1);
    
    const projectsPerPage = 4;
    const navigate = useNavigate();

    // Custom hook para gestionar proyectos
    const {
        projects,
        loading,
        error,
        addProject,
        removeProject,
        checkProfile,
        refresh,
    } = useCompanyProjects({ userType, id_usuario });

    // Handlers
    const handleDelete = async () => {
        const success = await removeProject(projectToDelete);
        if (success) {
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleCreateProject = async () => {
        const isComplete = await checkProfile();
        if (isComplete) {
            setShowModalProject(true);
        } else {
            setMessage(`Por favor, completa tu perfil de empresa antes de crear un ${terminologia.singular.toLowerCase()}.`);
            setMessageType('warning');
            setShowMessageModal(true);
        }
    };

    const handleEdit = (id) => navigate(`/projects/edit/${id}`);
    
    const handleViewDetails = (id) => navigate(`/empresa/proyectos/${id}`);

    /* Esta función interceptará el proyecto creado desde ModalCreateProject */
    const handleProjectCreated = (nuevoProyecto) => {
        addProject(nuevoProyecto);
        setShowModalProject(false); // Cierra el modal de creación
    };
    
    const openPublishModal = (project) => {
        console.log("Abriendo modal para proyecto:", project);
        setProjectToPublishData(project);
        setShowModalPublicar(true);
    };

    const openReleaseModal = (project) => {
        console.log('🔍 Abriendo modal de liberación para proyecto:', project);
        console.log('👤 Usuario actual (id_usuario):', id_usuario);
        setProjectToRelease(project);
        setReleaseModalOpen(true);
    };

    const confirmReleasePayment = async () => {
        setReleaseModalOpen(false);
        
        try {
            const response = await releaseProjectPayment(projectToRelease.id_proyecto);
            console.log('✅ Respuesta del servidor:', response);
            
            setMessage(
                `El pago de $${Number(projectToRelease.presupuesto * 0.90).toLocaleString('es-CL')} fue liberado exitosamente al estudiante. El ${terminologia.singular.toLowerCase()} "${projectToRelease.titulo}" ha sido marcado como completado.`
            );
            setMessageType('success');
            setShowMessageModal(true);
            
            if (refresh) {
                refresh();
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('❌ Error al liberar pago:', error);
            console.error('❌ Detalles del error:', error.response?.data);
            
            setMessage(error.response?.data?.error || 'Error al liberar el pago. Por favor, intenta nuevamente.');
            setMessageType('error');
            setShowMessageModal(true);
        } finally {
            setProjectToRelease(null);
        }
    };

    // Ordenamiento y paginación
    const sortedProjects = [...projects].sort((a, b) => {
        if (sortOption === 'Estado') {
            return a.estado_publicacion.localeCompare(b.estado_publicacion);
        }
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    });
    
    const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
    const currentProjects = sortedProjects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );

    if (loading) return <LoadingScreen />;

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800">Mis {terminologia.plural}</h3>
                    </div>
                    
                    {/* Create Button */}
                    <button 
                        className="flex items-center gap-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105"
                        onClick={handleCreateProject}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Crear {terminologia.singular}</span>
                    </button>
                </div>

                {/* Filters and Pagination */}
                <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                        </svg>
                        <select 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
                        >
                            <option value="Fecha">Ordenar por Fecha</option>
                            <option value="Estado">Ordenar por Estado</option>
                        </select>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg ml-auto">
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-[#07767c] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 shadow-sm font-bold text-gray-700"
                        >
                            ←
                        </button>
                        <span className="text-gray-700 font-semibold min-w-[100px] text-center">
                            Página {currentPage} de {totalPages || 1}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-[#07767c] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 shadow-sm font-bold text-gray-700"
                        >
                            →
                        </button>
                    </div>

                    {/* Projects Counter */}
                    <div className="flex items-center gap-2 bg-[#07767c]/10 px-4 py-2.5 rounded-lg">
                        <svg className="w-5 h-5 text-[#07767c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-[#07767c] font-semibold">
                            {projects.length} {projects.length === 1 ? terminologia.singular : terminologia.plural}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border-l-4 border-red-500 flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {currentProjects.length > 0 ? (
                    currentProjects.map((project) => (
                        <ProjectCard
                            key={project.id_proyecto}
                            project={project}
                            onPublish={openPublishModal}
                            onEdit={handleEdit}
                            onDelete={(id) => {
                                setProjectToDelete(id);
                                setDeleteModalOpen(true);
                            }}
                            onView={handleViewDetails}
                            onReleasePayment={openReleaseModal}
                            terminologia={terminologia}
                        />
                    ))
                ) : (
                    <div className="col-span-2 text-center py-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-lg font-medium mb-2">No tienes {terminologia.plural.toLowerCase()} aún</p>
                                <p className="text-gray-400 text-sm">Crea tu primer {terminologia.singular.toLowerCase()} para empezar</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            {showModalProject && (
                <ModalCreateProject 
                    closeModal={() => setShowModalProject(false)} 
                    addProject={handleProjectCreated}
                    id_usuario={id_usuario} 
                    terminologia={terminologia}
                    tipoParaBackend={tipoParaBackend}
                />
            )}
            
            {showModalPublicar && projectToPublishData && (
                <ModalPublicarProyecto 
                    closeModal={() => setShowModalPublicar(false)} 
                    id_usuario={id_usuario} 
                    projectData={projectToPublishData}
                    terminologia={terminologia}
                    tipoParaBackend={tipoParaBackend}
                />
            )}
            
            {showMessageModal && (
                <MessageModal 
                    message={message}
                    type={messageType}
                    closeModal={() => setShowMessageModal(false)} 
                />
            )}
            
            {deleteModalOpen && (
                <ConfirmModal 
                    isOpen={deleteModalOpen} 
                    onClose={() => setDeleteModalOpen(false)} 
                    onConfirm={handleDelete} 
                    message={`¿Estás seguro que deseas eliminar este ${terminologia.singular.toLowerCase()}?`}
                />
            )}
            
            {releaseModalOpen && projectToRelease && (
                <ReleasePaymentModal
                    isOpen={releaseModalOpen}
                    onClose={() => {
                        setReleaseModalOpen(false);
                        setProjectToRelease(null);
                    }}
                    onConfirm={confirmReleasePayment}
                    project={projectToRelease}
                    terminologia={terminologia}
                />
            )}
        </div>
    );
}

export default ViewProjects;