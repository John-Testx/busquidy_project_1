import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import MessageModal from "@/components/MessageModal";
import ModalCreateProject from "./ModalCreateProject";
import ModalPublicarProyecto from "./ModalPublicarProyecto";
import ProjectCard from "./ProjectCard";
import { useCompanyProjects } from "@/hooks";

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-[modalSlideIn_0.3s_ease-out]">
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-5">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-800 text-lg mb-8 text-center font-medium">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Confirmar Eliminación
          </button>
        </div>
      </div>
    </div>
  );
};

function ViewProjects({ userType, id_usuario }) {
    const [showModalProject, setShowModalProject] = useState(false);
    const [showModalPublicar, setShowModalPublicar] = useState(false);
    const [projectToPublish, setProjectToPublish] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

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
    } = useCompanyProjects({ userType, id_usuario });

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
            setMessage('Por favor, completa tu perfil de empresa antes de crear un proyecto.');
            setShowMessageModal(true);
        }
    };

    const handleSortChange = e => setSortOption(e.target.value);
    const handlePageChange = newPage => setCurrentPage(newPage);

    const sortedProjects = [...projects].sort((a, b) => {
        if (sortOption === 'Estado') return a.estado_publicacion.localeCompare(b.estado_publicacion);
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    });
    
    const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
    const currentProjects = sortedProjects.slice(
        (currentPage - 1) * projectsPerPage,
        currentPage * projectsPerPage
    );

    const handleEdit = id => navigate(`/projects/edit/${id}`);
    const handleViewDetails = id => console.log('View', id);
    const openPublishModal = id => {
        console.log("Abriendo modal para proyecto ID:", id);
        setProjectToPublish(id);
        setShowModalPublicar(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            {loading && <LoadingScreen />}

            {!loading && (
                <>
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
                                <h3 className="text-3xl font-bold text-gray-800">Mis Proyectos</h3>
                            </div>
                            
                            {/* Create Button */}
                            <button 
                                className="flex items-center gap-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105"
                                onClick={handleCreateProject}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Crear Proyecto</span>
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
                                    onChange={handleSortChange}
                                    className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
                                >
                                    <option value="Fecha">Ordenar por Fecha</option>
                                    <option value="Estado">Ordenar por Estado</option>
                                </select>
                            </div>
                            
                            {/* Pagination */}
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg ml-auto">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-[#07767c] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 transition-all duration-200 shadow-sm font-bold text-gray-700"
                                >
                                    ←
                                </button>
                                <span className="text-gray-700 font-semibold min-w-[100px] text-center">
                                    Página {currentPage} de {totalPages || 1}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
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
                                    {projects.length} {projects.length === 1 ? 'Proyecto' : 'Proyectos'}
                                </span>
                            </div>
                        </div>
                    </div>

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
                        {currentProjects.length > 0 ? currentProjects.map(project => (
                            <ProjectCard
                                key={project.id_proyecto}
                                project={project}
                                onPublish={openPublishModal}
                                onEdit={handleEdit}
                                onDelete={id => {
                                    setProjectToDelete(id);
                                    setDeleteModalOpen(true);
                                }}
                                onView={handleViewDetails}
                            />
                        )) : (
                            <div className="col-span-2 text-center py-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-lg font-medium mb-2">No tienes proyectos aún</p>
                                        <p className="text-gray-400 text-sm">Crea tu primer proyecto para empezar</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {showModalProject && (
                        <ModalCreateProject 
                            closeModal={() => setShowModalProject(false)} 
                            addProject={addProject} 
                            id_usuario={id_usuario} 
                        />
                    )}
                    {showModalPublicar && (
                        <ModalPublicarProyecto 
                            closeModal={() => setShowModalPublicar(false)} 
                            id_usuario={id_usuario} 
                            id_proyecto={projectToPublish} 
                        />
                    )}
                    {showMessageModal && (
                        <MessageModal 
                            message={message} 
                            closeModal={() => setShowMessageModal(false)} 
                        />
                    )}
                    {deleteModalOpen && (
                        <ConfirmModal 
                            isOpen={deleteModalOpen} 
                            onClose={() => setDeleteModalOpen(false)} 
                            onConfirm={handleDelete} 
                            message="¿Estás seguro que deseas eliminar este proyecto?" 
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ViewProjects;