import React from 'react';
import { Eye } from 'lucide-react';

export default function ProjectCard({ project, onPublish, onEdit, onDelete, onView, onReleasePayment, terminologia }) {
    const getStatusStyles = (status) => {
        switch(status) {
            case 'activo':
                return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-300';
            case 'pendiente':
                return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-300';
            case 'finalizado':
                return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-300';
            case 'sin publicar':
                return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-300';
            default:
                return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'activo':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'pendiente':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
            case 'finalizado':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 group overflow-hidden">
            {/* Decorative background gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#07767c]/5 to-transparent rounded-bl-full -z-0 transition-all duration-300 group-hover:w-40 group-hover:h-40"></div>
            
            {/* Botón Publicar */}
            {project.estado_publicacion === "sin publicar" && (
                <button
                    onClick={() => onPublish(project)}
                    className="absolute top-4 right-4 bg-gradient-to-r from-[#07767c] to-[#0a9199] hover:from-[#055a5f] hover:to-[#077d84] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-xl hover:scale-105 text-sm z-10 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Publicar
                </button>
            )}
           
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-800 mb-3 pr-28 group-hover:text-[#07767c] transition-colors line-clamp-2">
                    {project.titulo}
                </h3>
                <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                    {project.descripcion}
                </p>
           
                <div className="flex justify-between items-center mb-6 pb-5 border-b border-gray-100">
                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${getStatusStyles(project.estado_publicacion)}`}>
                        {getStatusIcon(project.estado_publicacion)}
                        <span className="capitalize">{project.estado_publicacion}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-2xl font-bold text-emerald-600">
                            ${Number(project.presupuesto).toLocaleString('es-CL')}
                        </span>
                    </div>
                </div>
           
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => onView(project.id_proyecto)}
                        className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-gray-50 hover:bg-[#07767c] hover:text-white text-gray-700 rounded-xl transition-all duration-200 text-sm font-medium group/btn"
                        title={`Ver ${terminologia.singular.toLowerCase()}`}
                    >
                        <Eye className="w-5 h-5" />
                        <span className="text-xs">Ver</span>
                    </button>
               
                    <button
                        onClick={() => onEdit(project.id_proyecto)}
                        className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-700 rounded-xl transition-all duration-200 text-sm font-medium group/btn"
                        title={`Editar ${terminologia.singular.toLowerCase()}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-xs">Editar</span>
                    </button>
               
                    <button
                        onClick={() => onDelete(project.id_proyecto)}
                        className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-700 rounded-xl transition-all duration-200 text-sm font-medium group/btn"
                        title={`Eliminar ${terminologia.singular.toLowerCase()}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-xs">Eliminar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}