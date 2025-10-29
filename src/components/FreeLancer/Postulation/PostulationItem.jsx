import React from 'react';
import { Eye, X, Calendar, Building2 } from 'lucide-react';

const PostulationItem = ({ postulation, onView, onCancel, calculateTimeAgo }) => {
    return (
        <div className="p-6 hover:bg-slate-50 transition-all duration-200 group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Info Principal */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative">
                        <img 
                            src={postulation.imageUrl || "https://via.placeholder.com/50"} 
                            alt="Logo Empresa" 
                            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 flex-shrink-0 group-hover:border-[#078b91] transition-colors duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#078b91] rounded-full border-2 border-white"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-lg truncate mb-1">
                            {postulation.titulo}
                        </p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <p className="text-sm truncate">
                                {postulation.nombre_empresa}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-3 lg:min-w-[200px]">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-[#078b91]" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-[#078b91]">
                            {calculateTimeAgo(postulation.fecha_publicacion)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {new Date(postulation.fecha_publicacion).toLocaleDateString('es-CL')}
                        </p>
                    </div>
                </div>

                {/* Estado */}
                <div className="lg:min-w-[150px]">
                    <span 
                        title="Estado de postulación"
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold ${
                            postulation.estado_postulacion === 'Aceptada' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : postulation.estado_postulacion === 'Rechazada'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : postulation.estado_postulacion === 'En revisión'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                    >
                        {postulation.estado_postulacion}
                    </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-3 lg:min-w-[120px] lg:justify-end">
                    <button
                        title="Ver publicación"
                        onClick={onView}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#078b91] text-white hover:bg-[#056166] transition-all duration-200 hover:scale-105"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        title="Cancelar postulación"
                        onClick={onCancel}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all duration-200 hover:scale-105"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostulationItem;