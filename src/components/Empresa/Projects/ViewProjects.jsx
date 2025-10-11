import React, { useEffect, useState } from "react";
// import "../../../styles/Empresa/ViewProjects.css";
import LoadingScreen from "../../LoadingScreen";
import MessageModal from "../../MessageModal";
import ModalCreateProject from "./ModalCreateProject";
import ModalPublicarProyecto from "./ModalPublicarProyecto";
//import ConfirmModal from "./ConfirmModal";
import ProjectCard from "./ProjectCard";
import { getProjects, deleteProject, checkCompanyProfile } from "../../../api/projectsService";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


// Modal de Confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <p className="text-gray-800 text-lg mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Confirmar
          </button>
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

    const [sortOption, setSortOption] = useState('Fecha');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4;

    const navigate = useNavigate();

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

    const handleEdit = id => 
        { 
            console.log('Edit', id); 
            navigate(`/projects/edit/${id}`);
        };

    const handleViewDetails = id => { console.log('View', id); };
    const openPublishModal = id => { setProjectToPublish(id); setShowModalPublicar(true); };

    return (
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-24 mb-36">
            {loading && <LoadingScreen />}

            {!loading && (
                <>
                    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                        <h3 className="text-3xl font-bold text-[#07767c]">Gestionar Proyectos</h3>
                        
                        <button 
                            className="flex items-center gap-2 bg-[#07767c] hover:bg-[#055a5f] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                            onClick={async () => {
                                const perfilIncompleto = await checkCompanyProfile(id_usuario);
                                if (!perfilIncompleto) setShowModalProject(true);
                                else {
                                    setMessage('Por favor, completa tu perfil de empresa antes de crear un proyecto.');
                                    setShowMessageModal(true);
                                }
                            }}
                        >
                            <i className="bi bi-plus text-xl font-bold" /> 
                            <span>Crear proyecto</span>
                        </button>
                        
                        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-lg shadow-md">
                            <select 
                                value={sortOption} 
                                onChange={handleSortChange}
                                className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
                            >
                                <option value="Estado">Estado</option>
                                <option value="Fecha">Fecha</option>
                            </select>
                            
                            <div className="flex items-center gap-3 border-l pl-4">
                                <button 
                                    onClick={() => handlePageChange(currentPage-1)} 
                                    disabled={currentPage===1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    &lt;
                                </button>
                                <span className="text-gray-700 font-medium min-w-[80px] text-center">
                                    {currentPage} de {totalPages || 1}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage+1)} 
                                    disabled={currentPage===totalPages || totalPages===0}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {currentProjects.length > 0 ? currentProjects.map(project => (
                            <ProjectCard
                                key={project.id_proyecto}
                                project={project}
                                onPublish={openPublishModal}
                                onEdit={handleEdit}
                                onDelete={id => { setProjectToDelete(id); setDeleteModalOpen(true); }}
                                onView={handleViewDetails}
                            />
                        )) : (
                            <p className="col-span-2 text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                                No has publicado ningún proyecto aún.
                            </p>
                        )}
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