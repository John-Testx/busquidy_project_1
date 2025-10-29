import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles, Lock, Loader2, DollarSign, Calendar, Tag } from "lucide-react";
import { getProjectById } from "@/api/projectsApi";
import { getPostulationsForProject } from "@/api/publicationsApi";
import PostulationCard from "@/components/Empresa/Projects/PostulationCard";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/Layouts/MainLayout";

function ProjectView() {
    const { idProyecto } = useParams();
    const navigate = useNavigate();
    
    const [projectDetails, setProjectDetails] = useState(null);
    const [postulations, setPostulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPostulations, setLoadingPostulations] = useState(false);
    const [error, setError] = useState(null);

    // Función helper para procesar habilidades
    const processSkills = (skills) => {
        if (!skills) return [];
        
        if (Array.isArray(skills)) return skills;
        
        if (typeof skills === 'string') {
            try {
                const parsed = JSON.parse(skills);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
            }
        }
        
        return [];
    };

    useEffect(() => {
        const loadProjectData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar detalles del proyecto
                const projectData = await getProjectById(idProyecto);
                console.log('📊 Datos del proyecto cargados:', projectData);
                console.log('📌 Estado de publicación:', projectData.estado_publicacion);
                console.log('📌 Tipo de estado:', typeof projectData.estado_publicacion);
                setProjectDetails(projectData);

                // Si está publicado, cargar postulaciones
                if (projectData.estado_publicacion === 'activo') {
                    setLoadingPostulations(true);
                    try {
                        const postulationsData = await getPostulationsForProject(idProyecto);
                        console.log('Postulaciones cargadas:', postulationsData);
                        setPostulations(Array.isArray(postulationsData) ? postulationsData : []);
                    } catch (postError) {
                        console.error('Error al cargar postulaciones:', postError);
                        setPostulations([]);
                    } finally {
                        setLoadingPostulations(false);
                    }
                }
            } catch (err) {
                console.error('Error al cargar proyecto:', err);
                setError(err.message || 'Error al cargar los detalles del proyecto');
            } finally {
                setLoading(false);
            }
        };

        if (idProyecto) {
            loadProjectData();
        }
    }, [idProyecto]);

    // Función para formatear estado
    const getStatusStyles = (status) => {
        switch(status) {
            case 'activo':
                return {
                    bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-300',
                    label: 'Publicado'
                };
            case 'pendiente':
                return {
                    bg: 'bg-gradient-to-r from-amber-100 to-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-300',
                    label: 'Pendiente'
                };
            case 'finalizado':
                return {
                    bg: 'bg-gradient-to-r from-blue-100 to-blue-50',
                    text: 'text-blue-700',
                    border: 'border-blue-300',
                    label: 'Finalizado'
                };
            case 'sin publicar':
                return {
                    bg: 'bg-gradient-to-r from-gray-100 to-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-300',
                    label: 'No Publicado'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-100 to-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-300',
                    label: status || 'Desconocido'
                };
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <MainLayout >
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-white px-4">
                    <div className="max-w-lg w-full p-8 text-center bg-white border-2 border-red-200 rounded-2xl shadow-xl">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-900">Error al Cargar Proyecto</h2>
                            <p className="text-gray-600 text-lg">{error}</p>
                        </div>
                        <button
                            onClick={() => navigate("/myprojects")}
                            className="w-full px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-semibold rounded-lg hover:from-[#05595d] hover:to-[#044449] transform hover:scale-105 transition-all duration-200 shadow-md"
                        >
                            Volver a Mis Proyectos
                        </button>
                    </div>
                </div>
                </ MainLayout>
            </div>
        );
    }

    if (!projectDetails) {
        return (
            <div className="min-h-screen flex flex-col">
                <MainLayout >
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
                    <p className="text-gray-600 text-lg">Proyecto no encontrado</p>
                </div>
                </ MainLayout>
            </div>
        );
    }

    const statusStyle = getStatusStyles(projectDetails.estado_publicacion);
    const skills = processSkills(projectDetails.habilidades_requeridas);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
            <MainLayout >
            
            <div className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header con botón volver */}
                    <button
                        onClick={() => navigate("/myprojects")}
                        className="flex items-center gap-2 text-[#07767c] hover:text-[#055a5f] font-medium mb-6 transition-colors duration-200"
                    >
                        <ArrowLeft size={20} />
                        Volver a Mis Proyectos
                    </button>

                    {/* Layout de dos columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna Izquierda: Detalles del Proyecto */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Card Principal */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                {/* Título y Estado */}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                    <h1 className="text-3xl font-bold text-gray-900 flex-1">
                                        {projectDetails.titulo}
                                    </h1>
                                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                        {statusStyle.label}
                                    </span>
                                </div>

                                {/* Descripción */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#07767c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        Descripción del Proyecto
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {projectDetails.descripcion || 'Sin descripción'}
                                    </p>
                                </div>

                                {/* Habilidades Requeridas */}
                                {skills.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-[#07767c]" />
                                            Habilidades Requeridas
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((habilidad, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#07767c]/10 to-[#0a9199]/10 text-[#07767c] rounded-lg text-sm font-medium border border-[#07767c]/20"
                                                >
                                                    {habilidad}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Detalles Clave */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                                    {/* Presupuesto */}
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Presupuesto</p>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                ${Number(projectDetails.presupuesto || 0).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duración */}
                                    {projectDetails.duracion_estimada && (
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Duración Estimada</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {projectDetails.duracion_estimada}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Sidebar de Acciones */}
                        <div className="space-y-6">
                            {/* Sección 1: Recomendaciones IA (Simulada) */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Recomendaciones IA</h3>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                                    <p className="text-sm text-purple-900 leading-relaxed">
                                        Sistema de recomendación IA en desarrollo. Próximamente podrás ver perfiles sugeridos aquí.
                                    </p>
                                </div>
                            </div>

                            {/* Sección 2: Postulaciones (Condicional) */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Postulaciones Recibidas</h3>
                                </div>

                                {/* Renderizado condicional de postulaciones */}
                                {loadingPostulations ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-8 h-8 text-[#07767c] animate-spin" />
                                    </div>
                                ) : projectDetails.estado_publicacion !== 'activo' ? (
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Lock className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            Publica tu proyecto para recibir y gestionar postulaciones.
                                        </p>
                                    </div>
                                ) : postulations.length === 0 ? (
                                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 text-center">
                                        <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-amber-800 leading-relaxed">
                                            Aún no hay postulaciones para este proyecto.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        {postulations.map((postulant, index) => (
                                            <PostulationCard key={postulant.id_usuario || index} postulant={postulant} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </ MainLayout>
        </div>
    );
}

export default ProjectView;