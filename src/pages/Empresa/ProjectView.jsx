import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    ArrowLeft, 
    Loader2, 
    DollarSign, 
    Calendar, 
    Tag, 
    CheckCircle, 
    MessageSquare, 
    ShieldAlert,
    Users,
    Sparkles
} from "lucide-react";
import { getProjectById } from "@/api/projectsApi"; 
import { getPostulationsForProject } from "@/api/publicationsApi";
import { getRecommendedFreelancers } from "@/api/freelancerApi";
import apiClient from "@/api/apiClient"; 
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/Layouts/MainLayout";
import { projectStatus } from "@/common/projectStatus";
import { processSkills } from "@/utils/processSkills";
import Swal from 'sweetalert2'; 

// COMPONENTES
import PostulationCard from "@/components/Empresa/Projects/PostulationCard";
import RecommendedFreelancerCard from '../../components/Empresa/Projects/RecommendedFreelancerCard';

function ProjectView() {
    const { idProyecto } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [postulations, setPostulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPostulations, setLoadingPostulations] = useState(false);
    const [error, setError] = useState(null);
    const [hiredFreelancer, setHiredFreelancer] = useState(null);
    
    // Estado para las tabs
    const [activeTab, setActiveTab] = useState('postulaciones'); // 'postulaciones' o 'recomendaciones'

    useEffect(() => {
        loadProjectData();
    }, [idProyecto]);

    const loadProjectData = async () => {
        if (!idProyecto || idProyecto === "undefined") {
            setError("ID de publicación inválido");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const projectData = await getProjectById(idProyecto);
            setProject(projectData);

            if (projectData.estado_publicacion === 'activo' || projectData.estado_publicacion === 'finalizado') {
                setLoadingPostulations(true);
                try {
                    const postulationsData = await getPostulationsForProject(idProyecto);
                    const posts = Array.isArray(postulationsData) ? postulationsData : [];
                    setPostulations(posts);
                    
                    const hired = posts.find(p => p.estado_postulacion === 'aceptada' || p.estado_postulacion === 'finalizada');
                    setHiredFreelancer(hired);
                } catch (postError) {
                    console.error('Error al cargar postulaciones:', postError);
                    setPostulations([]);
                } finally {
                    setLoadingPostulations(false);
                }
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (project && !hiredFreelancer) {
            const fetchRecommendations = async () => {
                setLoadingRecs(true);
                try {
                    const skills = processSkills(project.habilidades_requeridas);
                    const response = await getRecommendedFreelancers({
                        categoria: project.categoria,
                        habilidades_requeridas: skills,
                    });
                    setRecommended(response.data || []);
                } catch (error) {
                    console.error("Error recomendaciones:", error);
                } finally {
                    setLoadingRecs(false);
                }
            };
            fetchRecommendations();
        }
    }, [project, hiredFreelancer]);

    const handleReleasePayment = async () => {
        const result = await Swal.fire({
            title: '¿Confirmar finalización?',
            text: "Al confirmar, indicas que el trabajo fue entregado satisfactoriamente. Se liberará el pago al freelancer.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, liberar pago',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await apiClient.post(`/projects/release-payment/${idProyecto}`);
                Swal.fire('¡Éxito!', 'El proyecto ha sido finalizado y el pago liberado.', 'success');
                loadProjectData();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo liberar el pago.', 'error');
            }
        }
    };

    const handleOpenDispute = async () => {
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Detalla el motivo de la disputa',
            inputPlaceholder: 'Ej: El freelancer no entregó lo acordado...',
            inputAttributes: {
              'aria-label': 'Motivo de disputa'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar Reporte',
            confirmButtonColor: '#EF4444',
            cancelButtonText: 'Cancelar'
        });

        if (text) {
            try {
                await apiClient.post(`/projects/dispute/${idProyecto}`, {
                    motivo: text,
                    id_freelancer_usuario: hiredFreelancer.id_usuario
                });
                Swal.fire('Reporte Enviado', 'Un administrador revisará el caso y te contactará.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo registrar la disputa.', 'error');
            }
        }
    };

    if (loading) return <LoadingScreen />;
    
    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col">
                <MainLayout>
                    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-white px-4">
                        <div className="max-w-lg w-full p-8 text-center bg-white border-2 border-red-200 rounded-2xl shadow-xl">
                            <h2 className="text-3xl font-bold mb-3 text-gray-900">Error</h2>
                            <p className="text-gray-600 text-lg">{error || "Proyecto no encontrado"}</p>
                            <button
                                onClick={() => navigate("/myprojects")}
                                className="mt-6 px-6 py-3 bg-[#07767c] text-white rounded-lg"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </MainLayout>
            </div>
        );
    }

    const statusStyle = projectStatus(project.estado_publicacion);
    const skills = processSkills(project.habilidades_requeridas);
    
    const terminologia = project.tipo === 'tarea' 
        ? { singular: 'Tarea', plural: 'Tareas' } 
        : { singular: 'Proyecto', plural: 'Proyectos' };
    const delOdeLa = terminologia.singular === 'Tarea' ? 'de la' : 'del';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <MainLayout>
                <div className="flex-1 pt-24 pb-12 px-4 max-w-6xl mx-auto w-full">
                    
                    {/* Header con botón volver */}
                    <button 
                        onClick={() => navigate("/myprojects")} 
                        className="flex items-center gap-2 text-[#07767c] font-semibold mb-6 hover:gap-3 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Volver a Mis {terminologia.plural}</span>
                    </button>

                    {hiredFreelancer ? (
                        /* ============ VISTA CUANDO HAY FREELANCER CONTRATADO ============ */
                        <div className="space-y-6">
                            {/* Card de detalles del proyecto */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                {project.titulo}
                                            </h1>
                                            <p className="text-gray-600 leading-relaxed">
                                                {project.descripcion || 'Sin descripción'}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                            {statusStyle.label}
                                        </span>
                                    </div>

                                    {/* Habilidades */}
                                    {skills.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                Habilidades Requeridas de {terminologia.singular}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((habilidad, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="px-3 py-1.5 bg-[#07767c]/5 text-[#07767c] rounded-lg text-sm font-medium border border-[#07767c]/20"
                                                    >
                                                        {habilidad}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Presupuesto y Duración */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                            <DollarSign className="w-6 h-6 text-emerald-600" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium">Presupuesto</p>
                                                <p className="text-xl font-bold text-emerald-600">
                                                    ${Number(project.presupuesto || 0).toLocaleString('es-CL')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {project.duracion_estimada && (
                                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                                <div>
                                                    <p className="text-xs text-gray-600 font-medium">Duración</p>
                                                    <p className="text-xl font-bold text-blue-600">
                                                        {project.duracion_estimada}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card de freelancer contratado y acciones */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Info del freelancer */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Freelancer Contratado
                                        </h3>
                                    </div>
                                    
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#07767c] to-[#0a9199] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                                {hiredFreelancer.nombre.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-lg text-gray-900 truncate">{hiredFreelancer.nombre}</h4>
                                                <p className="text-sm text-gray-500 truncate">{hiredFreelancer.titulo_profesional}</p>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => navigate(`/chat/0`)} 
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#07767c] hover:bg-[#066065] text-white rounded-lg transition-colors font-semibold mb-3"
                                        >
                                            <MessageSquare size={18} />
                                            Ir al Chat
                                        </button>
                                        
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 mb-1">Email de contacto</p>
                                            <p className="text-sm text-gray-700 break-all">{hiredFreelancer.correo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones del proyecto */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className={`p-4 border-b flex items-center gap-3 ${
                                        project.estado_publicacion === 'finalizado' 
                                            ? 'bg-gray-50 border-gray-200' 
                                            : 'bg-emerald-50 border-emerald-100'
                                    }`}>
                                        <CheckCircle className={`w-5 h-5 ${
                                            project.estado_publicacion === 'finalizado' 
                                                ? 'text-gray-500' 
                                                : 'text-emerald-600'
                                        }`} />
                                        <h3 className={`text-sm font-bold uppercase tracking-wider ${
                                            project.estado_publicacion === 'finalizado' 
                                                ? 'text-gray-700' 
                                                : 'text-emerald-800'
                                        }`}>
                                            {project.estado_publicacion === 'finalizado' 
                                                ? 'Proyecto Finalizado' 
                                                : 'Trabajo en Curso'}
                                        </h3>
                                    </div>
                                    
                                    <div className="p-6">
                                        {project.estado_publicacion === 'finalizado' ? (
                                            <div className="text-center py-8">
                                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Completado!</h3>
                                                <p className="text-gray-600">
                                                    El pago ha sido liberado y el proyecto está cerrado.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Finaliza el proyecto cuando el trabajo esté completo.
                                                </p>
                                                
                                                <button 
                                                    onClick={handleReleasePayment}
                                                    className="w-full flex items-center justify-center gap-3 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-sm font-semibold"
                                                >
                                                    <DollarSign className="w-5 h-5" />
                                                    Liberar Pago y Finalizar
                                                </button>

                                                <button 
                                                    onClick={handleOpenDispute}
                                                    className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-red-200 hover:border-red-500 text-gray-700 hover:text-red-600 rounded-lg transition-all font-semibold"
                                                >
                                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                                    Iniciar Disputa
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ============ VISTA NORMAL: Card + Tabs + Tabla ============ */
                        <div className="space-y-6">
                            
                            {/* 1. CARD DE DETALLES DEL PROYECTO (Arriba, centrada) */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                {project.titulo}
                                            </h1>
                                            <p className="text-gray-600 leading-relaxed">
                                                {project.descripcion || 'Sin descripción'}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                            {statusStyle.label}
                                        </span>
                                    </div>

                                    {/* Habilidades */}
                                    {skills.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                Habilidades Requeridas de {terminologia.singular}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((habilidad, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="px-3 py-1.5 bg-[#07767c]/5 text-[#07767c] rounded-lg text-sm font-medium border border-[#07767c]/20"
                                                    >
                                                        {habilidad}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Presupuesto y Duración */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                            <DollarSign className="w-6 h-6 text-emerald-600" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium">Presupuesto</p>
                                                <p className="text-xl font-bold text-emerald-600">
                                                    ${Number(project.presupuesto || 0).toLocaleString('es-CL')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {project.duracion_estimada && (
                                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                                <div>
                                                    <p className="text-xs text-gray-600 font-medium">Duración Estimada</p>
                                                    <p className="text-xl font-bold text-blue-600">
                                                        {project.duracion_estimada}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. TABS DE NAVEGACIÓN (Botones centrados) */}
                            <div className="flex justify-center">
                                <div className="inline-flex bg-white rounded-xl border border-gray-200 shadow-sm p-1">
                                    <button
                                        onClick={() => setActiveTab('postulaciones')}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                            activeTab === 'postulaciones'
                                                ? 'bg-[#07767c] text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Users size={20} />
                                        <span>Postulaciones</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            activeTab === 'postulaciones'
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {postulations.length}
                                        </span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setActiveTab('recomendaciones')}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                            activeTab === 'recomendaciones'
                                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Sparkles size={20} />
                                        <span>Recomendación AI</span>
                                    </button>
                                </div>
                            </div>

                            {/* 3. PANEL/TABLA GRANDE (Contenido según tab seleccionado) */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                
                                {activeTab === 'postulaciones' ? (
                                    /* CONTENIDO: Postulaciones */
                                    <>
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                                <Users className="text-[#07767c]" size={24} />
                                                Postulantes al {terminologia.singular}
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {postulations.length} freelancer{postulations.length !== 1 ? 's' : ''} interesado{postulations.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            {loadingPostulations ? (
                                                <div className="flex flex-col items-center justify-center py-20">
                                                    <Loader2 className="w-12 h-12 animate-spin text-[#07767c] mb-4" />
                                                    <p className="text-gray-500">Cargando postulaciones...</p>
                                                </div>
                                            ) : postulations.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {postulations.map((p, i) => (
                                                        <PostulationCard 
                                                            key={p.id_usuario || i} 
                                                            postulant={p} 
                                                            onPostulantUpdate={loadProjectData}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-20">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Users className="w-10 h-10 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Aún no hay postulaciones
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">
                                                        Los freelancers interesados aparecerán aquí cuando se postulen
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    /* CONTENIDO: Recomendaciones AI */
                                    <>
                                        <div className="bg-gradient-to-r from-purple-50 to-white p-6 border-b border-purple-100">
                                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                                <Sparkles className="text-purple-600" size={24} />
                                                Recomendaciones Inteligentes
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Freelancers sugeridos según las habilidades del proyecto
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            {loadingRecs ? (
                                                <div className="flex flex-col items-center justify-center py-20">
                                                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                                                    <p className="text-gray-500">Buscando los mejores freelancers...</p>
                                                </div>
                                            ) : recommended.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {recommended.map(f => (
                                                        <RecommendedFreelancerCard 
                                                            key={f.id_freelancer} 
                                                            freelancer={f} 
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-20">
                                                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Sparkles className="w-10 h-10 text-purple-600" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                        Sin recomendaciones disponibles
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">
                                                        No encontramos freelancers que coincidan con los requisitos
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </MainLayout>
        </div>
    );
}

export default ProjectView;