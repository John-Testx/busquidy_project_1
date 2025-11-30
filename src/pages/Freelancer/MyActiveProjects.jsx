import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layouts/MainLayout';
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

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#07767c]" size={40} /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <MainLayout>
                <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Briefcase className="text-[#07767c]" />
                        Mis Trabajos Activos
                    </h1>

                    {projects.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="text-gray-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No tienes trabajos activos</h3>
                            <p className="text-gray-500 mt-1">Cuando una empresa te contrate, aparecerá aquí.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((p) => (
                                <div key={p.id_proyecto} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-xl font-bold text-gray-800">{p.titulo}</h2>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                p.estado_publicacion === 'finalizado' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {p.estado_publicacion === 'finalizado' ? 'Finalizado' : 'En Curso'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{p.nombre_empresa}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Entrega: {new Date(p.fecha_limite).toLocaleDateString()}
                                            </span>
                                            <span className="font-semibold text-[#07767c]">
                                                ${Number(p.presupuesto).toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/freelancer/proyecto/${p.id_proyecto}`)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#07767c] text-white rounded-lg hover:bg-[#066065] transition-colors"
                                    >
                                        Ver Detalles <ChevronRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </MainLayout>
        </div>
    );
};

export default MyActiveProjects;