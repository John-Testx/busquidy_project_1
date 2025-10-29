import React from 'react';
import { X, Eye, Sparkles, FileText, Clock, CheckCircle2, XCircle, Building2, MapPin, Timer, Calendar } from 'lucide-react';

const ViewPostulationModal = ({ isOpen, onClose, postulation }) => {
    if (!isOpen || !postulation) return null;

    /**
     * Renderiza el historial de estados
     */
    const renderStatusHistory = () => {
        const statusHistory = [
            { 
                status: 'Enviada', 
                date: postulation.fecha_publicacion,
                icon: <CheckCircle2 className="w-4 h-4" />,
                completed: true
            },
            { 
                status: 'En Revisión', 
                date: postulation.fecha_revision || postulation.fecha_publicacion,
                icon: <Clock className="w-4 h-4" />,
                completed: postulation.estado_postulacion === 'En revisión' || postulation.estado_postulacion === 'Aceptada' || postulation.estado_postulacion === 'Rechazada'
            },
            { 
                status: postulation.estado_postulacion === 'Aceptada' ? 'Aceptada' : postulation.estado_postulacion === 'Rechazada' ? 'Rechazada' : 'Pendiente',
                date: postulation.fecha_respuesta || null,
                icon: postulation.estado_postulacion === 'Aceptada' ? <CheckCircle2 className="w-4 h-4" /> : postulation.estado_postulacion === 'Rechazada' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />,
                completed: postulation.estado_postulacion === 'Aceptada' || postulation.estado_postulacion === 'Rechazada'
            }
        ];

        return statusHistory;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden animate-[modalSlideIn_0.3s_ease-out] flex flex-col">
                {/* Header del Modal - Más compacto */}
                <div className="bg-gradient-to-r from-[#056166] to-[#078b91] p-6 flex-shrink-0">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-2xl font-bold text-white mb-1 truncate">
                                    {postulation.titulo}
                                </h3>
                                <p className="text-white/80 text-sm">
                                    {postulation.nombre_empresa}
                                </p>
                            </div>
                        </div>
                        
                        {/* Estado actual */}
                        <span 
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold flex-shrink-0 ${
                                postulation.estado_postulacion === 'Aceptada' 
                                    ? 'bg-emerald-500 text-white' 
                                    : postulation.estado_postulacion === 'Rechazada'
                                    ? 'bg-rose-500 text-white'
                                    : postulation.estado_postulacion === 'En revisión'
                                    ? 'bg-amber-400 text-gray-900'
                                    : 'bg-blue-500 text-white'
                            }`}
                        >
                            {postulation.estado_postulacion}
                        </span>

                        {/* Botón cerrar con X giratoria */}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 flex-shrink-0 group"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Contenido del Modal - Layout horizontal en 2 columnas */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        {/* COLUMNA IZQUIERDA */}
                        <div className="space-y-6">
                            {/* Sección: Resumen del Proyecto */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-[#078b91]" />
                                    <h4 className="text-lg font-bold text-gray-900">Resumen del Proyecto</h4>
                                </div>
                                
                                <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 space-y-4">
                                    {/* Descripción */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Descripción:</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {postulation.descripcion || 'No hay descripción disponible para este proyecto.'}
                                        </p>
                                    </div>

                                    {/* Requisitos */}
                                    {postulation.requisitos && (
                                        <div className="pt-3 border-t border-gray-300">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Requisitos:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {postulation.requisitos.split(',').map((req, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700">
                                                        {req.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información logística */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 className="w-5 h-5 text-[#078b91]" />
                                    <h4 className="text-lg font-bold text-gray-900">Información del Proyecto</h4>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-5 h-5 text-[#078b91]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-500">Empresa</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{postulation.nombre_empresa}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-[#078b91]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-500">Modalidad</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{postulation.modalidad || 'No especificada'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Timer className="w-5 h-5 text-[#078b91]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-500">Duración</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{postulation.duracion || 'No especificada'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-[#078b91]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-500">Publicado</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {new Date(postulation.fecha_publicacion).toLocaleDateString('es-CL')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="space-y-6">
                            {/* Sección: Tu Postulación */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-[#078b91]" />
                                    <h4 className="text-lg font-bold text-gray-900">Tu Postulación</h4>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Mensaje de presentación:</p>
                                        <p className="text-gray-600 text-sm leading-relaxed italic">
                                            "{postulation.mensaje_presentacion || 'No enviaste un mensaje de presentación con esta postulación.'}"
                                        </p>
                                    </div>

                                    {postulation.cv_enviado && (
                                        <div className="pt-3 border-t border-blue-300">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">CV/Portafolio enviado:</p>
                                            <a 
                                                href={postulation.cv_enviado} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-[#078b91] hover:text-[#056166] font-medium text-sm transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Ver documento adjunto
                                            </a>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-blue-300">
                                        <p className="text-xs text-gray-600">
                                            Postulaste el {new Date(postulation.fecha_publicacion).toLocaleDateString('es-CL', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección: Historial de Estado */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-5 h-5 text-[#078b91]" />
                                    <h4 className="text-lg font-bold text-gray-900">Historial de Estado</h4>
                                </div>
                                
                                <div className="bg-slate-50 border border-gray-200 rounded-xl p-4">
                                    <div className="space-y-3">
                                        {renderStatusHistory().map((item, index) => (
                                            <div key={index} className="relative">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        item.completed 
                                                            ? 'bg-[#078b91] text-white' 
                                                            : 'bg-gray-200 text-gray-400'
                                                    }`}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1 pt-1">
                                                        <p className={`font-semibold text-sm ${
                                                            item.completed ? 'text-gray-900' : 'text-gray-400'
                                                        }`}>
                                                            {item.status}
                                                        </p>
                                                        {item.date && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(item.date).toLocaleDateString('es-CL', { 
                                                                    year: 'numeric', 
                                                                    month: 'long', 
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Línea conectora */}
                                                {index < renderStatusHistory().length - 1 && (
                                                    <div 
                                                        className={`absolute left-5 top-10 w-0.5 h-6 ${
                                                            item.completed ? 'bg-[#078b91]' : 'bg-gray-200'
                                                        }`}
                                                    ></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPostulationModal;