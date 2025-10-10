import React from 'react';

export default function ProjectCard({ project, onPublish, onEdit, onDelete, onView }) {
    const getStatusStyles = (status) => {
        switch(status) {
            case 'activo': 
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'pendiente': 
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'finalizado': 
                return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'sin publicar':
                return 'bg-gray-100 text-gray-700 border border-gray-200';
            default: 
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    return (
        <div className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            {project.estado_publicacion === "sin publicar" && (
                <button 
                    onClick={() => onPublish(project.id_proyecto)} 
                    className="absolute top-4 right-4 bg-[#07767c] hover:bg-[#055a5f] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                    Publicar
                </button>
            )}
            
            <h3 className="text-xl font-bold text-gray-800 mb-3 pr-24">{project.titulo}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{project.descripcion}</p>
            
            <div className="flex justify-between items-center mb-5">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyles(project.estado_publicacion)}`}>
                    {project.estado_publicacion}
                </span>
                <span className="text-lg font-bold text-emerald-600">
                    ${Number(project.presupuesto).toLocaleString('es-CL')}
                </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
                <button 
                    onClick={() => onView(project.id_proyecto)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                    <i className="bi bi-info-circle"></i>
                    <span>Ver</span>
                </button>
                
                <button 
                    onClick={() => onEdit(project.id_proyecto)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                    <i className="bi bi-pencil"></i>
                    <span>Editar</span>
                </button>
                
                <button 
                    onClick={() => onDelete(project.id_proyecto)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                    <i className="bi bi-trash"></i>
                    <span>Eliminar</span>
                </button>
            </div>
        </div>
    );
}