import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import MessageModal from "@/components/MessageModal";
import ModalCreateProject from "./ModalCreateProject";
import ModalPublicarProyecto from "./ModalPublicarProyecto";
import ProjectCard from "./ProjectCard";
import { useCompanyProjects } from "@/hooks";
import { releaseProjectPayment } from "@/api/projectsApi";
import { X, CheckCircle } from "lucide-react";

// Modal de Confirmación para Eliminar
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

// Modal de Confirmación para Liberar Pago
const ReleasePaymentModal = ({ isOpen, onClose, onConfirm, project }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim().toUpperCase() !== "CONFIRMAR") {
      setError("Debes escribir exactamente 'CONFIRMAR' para proceder");
      return;
    }
    onConfirm();
    setInputValue("");
    setError("");
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  const comision = project?.presupuesto * 0.10;
  const montoFreelancer = project?.presupuesto * 0.90;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6">
          {/* Icono de éxito */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-4 mx-auto">
            <CheckCircle size={48} />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-emerald-800 mb-3 text-center">
            Completar Proyecto y Liberar Pago
          </h3>

          {/* Información del proyecto */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Proyecto:</span> {project?.titulo}
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Monto total:</span>
                <span className="font-bold text-gray-900">
                  ${Number(project?.presupuesto).toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Comisión plataforma (10%):</span>
                <span className="font-bold text-amber-600">
                  -${Number(comision).toLocaleString('es-CL')}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Pago al freelancer:</span>
                <span className="font-bold text-emerald-600 text-lg">
                  ${Number(montoFreelancer).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>

          {/* Mensaje de advertencia */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4 rounded">
            <p className="text-emerald-800 text-sm font-medium mb-2">
              ✅ Al confirmar esta acción:
            </p>
            <ul className="text-emerald-700 text-sm space-y-1 list-disc list-inside">
              <li>El freelancer recibirá el pago acordado</li>
              <li>El proyecto será marcado como finalizado</li>
              <li>Esta acción <span className="font-bold">NO se puede deshacer</span></li>
            </ul>
          </div>

          {/* Input de confirmación */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Para confirmar, escribe <span className="text-emerald-600 font-bold">CONFIRMAR</span>:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="Escribe CONFIRMAR"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={inputValue.trim().toUpperCase() !== "CONFIRMAR"}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Liberar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ViewProjects({ userType, id_usuario }) {
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
            setMessageType('warning');
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
    
    const openPublishModal = (project) => {
        console.log("Abriendo modal para proyecto:", project);
        setProjectToPublishData({
            id_proyecto: project.id_proyecto,
            titulo: project.titulo,
            presupuesto: project.presupuesto
        });
        setShowModalPublicar(true);
    };

    // Handler para abrir modal de liberación
    const openReleaseModal = (project) => {
        console.log('🔍 Abriendo modal de liberación para proyecto:', project);
        console.log('👤 Usuario actual (id_usuario):', id_usuario);
        setProjectToRelease(project);
        setReleaseModalOpen(true);
    };

    // Handler para confirmar liberación
    const confirmReleasePayment = async () => {
        setReleaseModalOpen(false);
        
        try {
            const response = await releaseProjectPayment(projectToRelease.id_proyecto);
            console.log('✅ Respuesta del servidor:', response);
            
            setMessage(
                `El pago de $${Number(projectToRelease.presupuesto * 0.90).toLocaleString('es-CL')} fue liberado exitosamente al freelancer. El proyecto "${projectToRelease.titulo}" ha sido marcado como completado.`
            );
            setMessageType('success');
            setShowMessageModal(true);
            
            // Recargar la lista de proyectos
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
                                onReleasePayment={openReleaseModal}
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
                    {showModalPublicar && projectToPublishData && (
                        <ModalPublicarProyecto 
                            closeModal={() => setShowModalPublicar(false)} 
                            id_usuario={id_usuario} 
                            projectData={projectToPublishData}
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
                            message="¿Estás seguro que deseas eliminar este proyecto?" 
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
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ViewProjects;