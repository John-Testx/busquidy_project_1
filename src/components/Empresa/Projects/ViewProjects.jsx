import React, { useEffect, useState } from "react";
import "../../../styles/Empresa/ViewProjects.css";
import LoadingScreen from "../../LoadingScreen";
import MessageModal from "../../MessageModal";
import ModalCreateProject from "./ModalCreateProject";
import ModalPublicarProyecto from "./ModalPublicarProyecto";
//import ConfirmModal from "./ConfirmModal";
import ProjectCard from "./ProjectCard";
import { getProjects, deleteProject, checkCompanyProfile } from "../../../api/projectsService";
import { toast } from 'react-toastify';

// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-project">
      <div className="modal-content-project">
        <p>{message}</p>
        <div className="modal-actions-project">
          <button onClick={onClose} className="cancel-btn-project">Cancelar</button>
          <button onClick={onConfirm} className="confirm-btn-project">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

function ViewProjects({ userType, id_usuario }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModalProject, setShowModalProject] = useState(false);
    const [showModalPublicar, setShowModalPublicar] = useState(false);
    const [projectToPublish, setProjectToPublish] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Pagination & Sorting
    const [sortOption, setSortOption] = useState('Fecha');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4;

    useEffect(() => {
        loadProjects();
    }, [userType, id_usuario]);

    const loadProjects = async () => {
        if (userType !== 'empresa') return;
        setLoading(true);
        setError(null);
        try {
            const data = await getProjects(id_usuario);
            setProjects(data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar proyectos');
            toast.error('Algo salió mal al cargar los proyectos.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = (newProject) => {
        setProjects(prev => [newProject, ...prev]);
    };

    const handleDelete = async () => {
        try {
            await deleteProject(projectToDelete);
            setProjects(prev => prev.filter(p => p.id_proyecto !== projectToDelete));
            toast.success('Proyecto eliminado correctamente');
        } catch (err) {
            toast.error('Error al eliminar proyecto');
        } finally {
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleSortChange = e => setSortOption(e.target.value);
    const handlePageChange = newPage => setCurrentPage(newPage);

    const sortedProjects = [...projects].sort((a,b) => {
        if (sortOption === 'Estado') return a.estado_publicacion.localeCompare(b.estado_publicacion);
        return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    });
    const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);
    const currentProjects = sortedProjects.slice((currentPage-1)*projectsPerPage, currentPage*projectsPerPage);

    // Placeholder callbacks
    const handleEdit = id => { console.log('Edit', id); };
    const handleViewDetails = id => { console.log('View', id); };
    const openPublishModal = id => { setProjectToPublish(id); setShowModalPublicar(true); };

    return (
        <div className="view-projects-container">
            {loading && <LoadingScreen />}

            {!loading && (
                <>
                    <div className="header">
                        <h3>Gestionar Proyectos</h3>
                        <button className="publish-project-btn" onClick={async () => {
                            const perfilIncompleto = await checkCompanyProfile(id_usuario);
                            if (!perfilIncompleto) setShowModalProject(true);
                            else {
                                setMessage('Por favor, completa tu perfil de empresa antes de crear un proyecto.');
                                setShowMessageModal(true);
                            }
                        }}>
                            <i className="bi bi-plus" /> Crear proyecto
                        </button>
                        <div className="sort-pagination-box">
                            <select value={sortOption} onChange={handleSortChange}>
                                <option value="Estado">Estado</option>
                                <option value="Fecha">Fecha</option>
                            </select>
                            <div className="pagination">
                                <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1}>&lt;</button>
                                <span>{currentPage} de {totalPages}</span>
                                <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages || totalPages===0}>&gt;</button>
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="projects-list">
                        {currentProjects.length > 0 ? currentProjects.map(project => (
                            <ProjectCard
                                key={project.id_proyecto}
                                project={project}
                                onPublish={openPublishModal}
                                onEdit={handleEdit}
                                onDelete={id => { setProjectToDelete(id); setDeleteModalOpen(true); }}
                                onView={handleViewDetails}
                            />
                        )) : <p>No has publicado ningún proyecto aún.</p>}
                    </div>

                    {showModalProject && <ModalCreateProject closeModal={() => setShowModalProject(false)} addProject={handleAddProject} id_usuario={id_usuario} />}
                    {showModalPublicar && <ModalPublicarProyecto closeModal={() => setShowModalPublicar(false)} id_usuario={id_usuario} id_proyecto={projectToPublish} />}
                    {showMessageModal && <MessageModal message={message} closeModal={() => setShowMessageModal(false)} />}
                    {deleteModalOpen && <ConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} message="¿Estás seguro que deseas eliminar este proyecto?" />}
                </>
            )}
        </div>
    );
}

export default ViewProjects;
