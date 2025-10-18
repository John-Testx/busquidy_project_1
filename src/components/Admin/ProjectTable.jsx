import React, { useState, useEffect } from "react";
import { getAllProjects, updateProjectState, deleteProject } from "@/api/projectsApi";
import { toast } from 'react-toastify';
import MessageModal from "../MessageModal";
import TableCommon from "@/common/TableCommon";
import { Pencil, XCircle } from "lucide-react";
import '../../styles/Admin/ProjectTable.css';

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

function ProjectTable() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [projectToDespost, setProjectToDespost] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null);

    // Cargar proyectos
    const cargarAdminProyectos = async () => {
        try {
            setError(null);
            const response = await getAllProjects();
            setProjects(response.data);
        } catch (error) {
            setError(error.message);
            console.error('Error al cargar los proyectos:', error);
        }
    };

    useEffect(() => {
        cargarAdminProyectos();
    }, []);

    // Funciones para manejar "despublicar"
    const confirmDespostProject = (id_proyecto) => {
        setMessage("¿Estás seguro que deseas despublicar este proyecto?");
        setActionType("despublicar");
        setProjectToDespost(id_proyecto);
        setDeleteModalOpen(true);
    };

    const handleDespost = async () => {
        try {
            setLoading(true);
            await updateProjectState(projectToDespost, "cancelado");
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id_proyecto === projectToDespost
                        ? { ...project, estado_publicacion: "cancelado" }
                        : project
                )
            );
            toast.success("Proyecto despublicado correctamente");
            setDeleteModalOpen(false);
            setProjectToDespost(null);
        } catch (error) {
            toast.error(error.message || "Error al despublicar el proyecto");
        } finally {
            setLoading(false);
        }
    };

    // Funciones de Eliminación
    const confirmDeleteProject = (id_proyecto) => {
        setMessage("¿Estás seguro que deseas eliminar este proyecto?")
        setActionType("eliminar");
        setProjectToDelete(id_proyecto);
        setDeleteModalOpen(true);
    };

    const handleDeleteProjects = async () => {
        try {
            setLoading(true);
            await deleteProject(projectToDelete);
            setProjects(prevProjects =>
                prevProjects.filter(project => project.id_proyecto !== projectToDelete)
            );
            toast.success('Proyecto eliminado correctamente');
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        } catch (error) {
            toast.error(error.message || 'Error al eliminar el proyecto');
        } finally {
            setLoading(false);
        }
    };

    // Manejar confirmación de acciones desde el modal
    const handleModalConfirm = () => {
        if (actionType === "eliminar") {
            handleDeleteProjects();
        } else if (actionType === "despublicar") {
            handleDespost();
        }
    };

    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    // Función para formatear fechas de manera segura
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    // Definición de columnas para TableCommon
    const columns = [
        { key: "id_proyecto", label: "ID Proyecto", sortable: true },
        { key: "id_empresa", label: "ID Empresa", sortable: true },
        { key: "titulo", label: "Título", sortable: true },
        {
            key: "estado_publicacion",
            label: "Estado",
            sortable: true,
            render: (value) => (
                <span className={`badge ${(value || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {value || 'Sin definir'}
                </span>
            )
        },
        {
            key: "fecha_creacion",
            label: "Fecha Creación",
            sortable: true,
            render: (value) => value ? formatDate(value) : 'No publicado'
        },
        {
            key: "fecha_publicacion",
            label: "Fecha Publicación",
            sortable: true,
            render: (value) => value ? formatDate(value) : 'No publicado'
        },
        { key: "categoria", label: "Categoría", sortable: true, render: (value) => value || 'No especificada' },
        {
            key: "publicaciones",
            label: "Publicaciones",
            render: (value) =>
                value && value.length > 0 ? (
                    <ul>
                        {value.map((pub, index) => (
                            <li key={index}>{pub.titulo || `Publicación ${index + 1}`}</li>
                        ))}
                    </ul>
                ) : (
                    <span className="no-publications">Sin publicaciones</span>
                )
        },
        {
            key: "acciones",
            label: "Acciones",
            render: (value, row) => (
                <div className="action-buttons">
                    <button
                        className="reject-btn"
                        title="Despublicar"
                        onClick={() => confirmDespostProject(row.id_proyecto)}
                    >
                        <XCircle size={16} />
                    </button>
                    <button className="edit-btn" title="Modificar">
                        <Pencil size={16} />
                    </button>
                    <button
                        className="delete-btn"
                        title="Eliminar"
                        onClick={() => confirmDeleteProject(row.id_proyecto)}
                    >
                        <i className="bi bi-trash" style={{ margin: "0 auto", fontSize: "16px" }}></i>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="project-management">
            <div className="project-container">
                <div className="header-section">
                    <h1>Gestión de Proyectos</h1>
                </div>
                <div className="table-container">
                    <TableCommon
                        columns={columns}
                        data={projects}
                        searchPlaceholder="Buscar proyectos..."
                        emptyMessage="No hay proyectos registrados en la base de datos."
                        tableClassName="project-table"
                    />
                </div>
            </div>
            {showMessageModal && (
                <MessageModal message={message} closeModal={closeMessageModal} />
            )}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setActionType(null);
                }}
                onConfirm={handleModalConfirm}
                message={message}
            />
        </div>
    );
}

export default ProjectTable;