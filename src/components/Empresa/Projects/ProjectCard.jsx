import React from 'react';

export default function ProjectCard({ project, onPublish, onEdit, onDelete, onView }) {

    const getStatusColor = (status) => {
        switch(status) {
            case 'activo': return 'status-active';
            case 'pendiente': return 'status-pending';
            case 'finalizado': return 'status-completed';
            default: return 'status-default';
        }
    };

    return (
        <div className="project-card">
            {project.estado_publicacion === "sin publicar" && (
                <button onClick={() => onPublish(project.id_proyecto)} className="publish-btn">
                    Publicar
                </button>
            )}
            <h3>{project.titulo}</h3>
            <p>{project.descripcion}</p>
            <div className="project-details">
                <span className={`project-estado ${getStatusColor(project.estado_publicacion)}`}>
                    {project.estado_publicacion}
                </span>
                <span className="project-budget">${project.presupuesto}</span>
            </div>
            <div className="project-actions">
                <button onClick={() => onView(project.id_proyecto)}>
                    <i className="bi bi-info-circle"></i> Ver Detalles
                </button>
                <button onClick={() => onEdit(project.id_proyecto)}>
                    <i className="bi bi-pencil"></i> Editar
                </button>
                <button onClick={() => onDelete(project.id_proyecto)} className="delete-btn">
                    <i className="bi bi-trash"></i> Eliminar
                </button>
            </div>
        </div>
    );
}
