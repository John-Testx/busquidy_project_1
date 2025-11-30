import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';
import { Loader2, Briefcase, Calendar, ChevronRight } from 'lucide-react';

const MyActiveProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get('/freelancer/mis-proyectos-activos');
                setProjects(response.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#07767c] mx-auto mb-4" size={48} />
                    <p className="text-gray-600 text-lg font-medium">Cargando tus trabajos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header estandarizado */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
                            <Briefcase className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Mis Trabajos</h1>
                            <p className="text-gray-600">Gestiona tus proyectos activos</p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {projects.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="text-gray-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes trabajos activos</h3>
                            <p className="text-gray-500">Cuando una empresa te contrate, aparecerá aquí.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {projects.map((p) => (
                                <div key={p.id_proyecto} className="p-6 hover:bg-gray-50 transition-all duration-200">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-xl font-bold text-gray-900">{p.titulo}</h2>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                                    p.estado_publicacion === 'finalizado' 
                                                        ? 'bg-gray-100 text-gray-600' 
                                                        : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {p.estado_publicacion === 'finalizado' ? 'Finalizado' : 'En Curso'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{p.nombre_empresa}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} /> 
                                                    Entrega: {new Date(p.fecha_limite).toLocaleDateString('es-CL')}
                                                </span>
                                                <span className="font-bold text-[#07767c]">
                                                    ${Number(p.presupuesto).toLocaleString('es-CL')}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/freelancer-profile/mis-trabajos/${p.id_proyecto}`)}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                        >
                                            Ver Detalles <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyActiveProjects;