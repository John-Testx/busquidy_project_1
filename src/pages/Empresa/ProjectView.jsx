import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
    ArrowLeft, 
    Lock, 
    Loader2, 
    DollarSign, 
    Calendar, 
    Tag, 
    CheckCircle, 
    MessageSquare, 
    ShieldAlert 
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

    // Estado para detectar freelancer contratado
    const [hiredFreelancer, setHiredFreelancer] = useState(null);

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
            setProject(projectData); // Guardamos en 'project' (antes era projectDetails, unificamos)

            if (projectData.estado_publicacion === 'activo' || projectData.estado_publicacion === 'finalizado') {
                setLoadingPostulations(true);
                try {
                    const postulationsData = await getPostulationsForProject(idProyecto);
                    const posts = Array.isArray(postulationsData) ? postulationsData : [];
                    setPostulations(posts);
                    
                    // ✅ DETECTAR SI HAY ALGUIEN CONTRATADO
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

    // Cargar recomendaciones solo si NO hay contratado
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

    // ✅ FUNCIÓN: Liberar Pago (Terminar Trabajo)
    const handleReleasePayment = async () => {
        const result = await Swal.fire({
            title: '¿Confirmar finalización?',
            text: "Al confirmar, indicas que el trabajo fue entregado satisfactoriamente. Se liberará el pago al freelancer.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // Emerald 500
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, liberar pago',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await apiClient.post(`/projects/release-payment/${idProyecto}`);
                
                Swal.fire('¡Éxito!', 'El proyecto ha sido finalizado y el pago liberado.', 'success');
                // Recargar datos para actualizar estado
                loadProjectData();
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo liberar el pago.', 'error');
            }
        }
    };

    // ✅ FUNCIÓN: Iniciar Disputa
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
            confirmButtonColor: '#EF4444', // Red 500
            cancelButtonText: 'Cancelar'
        });

        if (text) {
            try {
                await apiClient.post(`/projects/dispute/${idProyecto}`, {
                    motivo: text,
                    id_freelancer_usuario: hiredFreelancer.id_usuario // ID Usuario del freelancer
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

    // Lógica visual del antiguo código restaurada
    const statusStyle = projectStatus(project.estado_publicacion);
    const skills = processSkills(project.habilidades_requeridas);
    
    // Terminología dinámica (Proyecto vs Tarea)
    const terminologia = project.tipo === 'tarea' 
        ? { singular: 'Tarea', plural: 'Tareas' } 
        : { singular: 'Proyecto', plural: 'Proyectos' };
    const delOdeLa = terminologia.singular === 'Tarea' ? 'de la' : 'del';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
            <MainLayout>
                <div className="flex-1 pt-24 pb-12 px-4 max-w-7xl mx-auto w-full">
                    
                    {/* Header */}
                    <button onClick={() => navigate("/myprojects")} className="flex items-center gap-2 text-[#07767c] font-medium mb-6 hover:underline">
                        <ArrowLeft size={20} /> Volver a Mis {terminologia.plural}
                    </button>

                    {/* Layout de dos columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* ========================================================= */}
                        {/* 1. CARD DE DETALLES (COLUMNA IZQUIERDA - RESTAURADA)      */}
                        {/* ========================================================= */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                {/* Título y Estado */}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                    <h1 className="text-3xl font-bold text-gray-900 flex-1">
                                        {project.titulo}
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
                                        Descripción {delOdeLa} {terminologia.singular}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {project.descripcion || 'Sin descripción'}
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
                                                <span key={index} className="px-4 py-2 bg-gradient-to-r from-[#07767c]/10 to-[#0a9199]/10 text-[#07767c] rounded-lg text-sm font-medium border border-[#07767c]/20">
                                                    {habilidad}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Detalles Clave (Presupuesto y Duración) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                                    {/* Presupuesto */}
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">Presupuesto</p>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                ${Number(project.presupuesto || 0).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duración */}
                                    {project.duracion_estimada && (
                                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Calendar className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Duración Estimada</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {project.duracion_estimada}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ========================================================= */}
                        {/* 2. SIDEBAR DE ACCIONES (COLUMNA DERECHA)                  */}
                        {/* ========================================================= */}
                        <div className="space-y-6">
                            
                            {hiredFreelancer ? (
                                /* --- MODO: FREELANCER CONTRATADO --- */
                                <>
                                    {/* Validar si el proyecto está FINALIZADO */}
                                    {project.estado_publicacion === 'finalizado' ? (
                                        /* VISTA: PROYECTO FINALIZADO */
                                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-3">
                                                <CheckCircle className="text-gray-500 w-6 h-6" />
                                                <h2 className="text-lg font-bold text-gray-700">Proyecto Finalizado</h2>
                                            </div>
                                            
                                            <div className="p-8 text-center">
                                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-800 mb-3">¡Trabajo Completado!</h3>
                                                <p className="text-gray-600 text-lg max-w-md mx-auto">
                                                    El pago ha sido liberado y el proyecto se encuentra cerrado.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* VISTA: TRABAJO EN CURSO (Con acciones) */
                                        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
                                            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-3">
                                                <CheckCircle className="text-emerald-600 w-6 h-6" />
                                                <h2 className="text-lg font-bold text-emerald-800">Trabajo en Curso</h2>
                                            </div>
                                            
                                            <div className="p-6">
                                                <p className="text-gray-600 mb-6 text-sm">
                                                    Gestiona el contrato con <strong>{hiredFreelancer.nombre}</strong>.
                                                </p>

                                                <div className="space-y-3">
                                                    <button 
                                                        onClick={handleReleasePayment}
                                                        className="w-full flex items-center justify-center gap-3 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md group"
                                                    >
                                                        <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                        <div className="text-left">
                                                            <span className="block font-bold leading-none">Liberar Pago</span>
                                                            <span className="text-emerald-100 text-xs">Finalizar trabajo</span>
                                                        </div>
                                                    </button>

                                                    <button 
                                                        onClick={handleOpenDispute}
                                                        className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-red-100 hover:border-red-500 text-gray-600 hover:text-red-600 rounded-xl transition-all group"
                                                    >
                                                        <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform text-red-500" />
                                                        <div className="text-left">
                                                            <span className="block font-bold leading-none">Iniciar Disputa</span>
                                                            <span className="text-xs text-gray-400 group-hover:text-red-400">Reportar problema</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tarjeta de Info del Freelancer */}
                                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Contratado</h3>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                                                {hiredFreelancer.nombre.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{hiredFreelancer.nombre}</h4>
                                                <p className="text-xs text-gray-500">{hiredFreelancer.titulo_profesional}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <button 
                                                onClick={() => navigate(`/chat/0`)} 
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#07767c] text-white rounded-lg hover:bg-[#066065] transition-colors"
                                            >
                                                <MessageSquare size={18} />
                                                Ir al Chat
                                            </button>
                                            <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 break-all">
                                                <span className="font-semibold block mb-1">Email:</span>
                                                {hiredFreelancer.correo}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* --- MODO: BÚSQUEDA (Recomendaciones y Postulantes) --- */
                                <>
                                    {/* Sección 1: Recomendaciones IA */}
                                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Tag className="text-[#07767c] w-5 h-5" />
                                            <h2 className="text-lg font-bold text-gray-800">Recomendaciones</h2>
                                        </div>
                                        
                                        {loadingRecs ? (
                                            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#07767c]" /></div>
                                        ) : recommended.length > 0 ? (
                                            <div className="space-y-4">
                                                {recommended.slice(0, 3).map(f => (
                                                    <RecommendedFreelancerCard key={f.id_freelancer} freelancer={f} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">Sin recomendaciones automáticas.</p>
                                        )}
                                    </div>

                                    {/* Sección 2: Postulaciones */}
                                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-[500px] flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="bg-[#07767c] text-white text-xs px-2 py-1 rounded-full">{postulations.length}</span>
                                            Postulantes
                                        </h3>
                                        
                                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                            {loadingPostulations ? (
                                                <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-[#07767c]" /></div>
                                            ) : postulations.length > 0 ? (
                                                postulations.map((p, i) => (
                                                    <PostulationCard key={p.id_usuario || i} postulant={p} />
                                                ))
                                            ) : (
                                                <div className="text-center py-10 text-gray-400 text-sm">
                                                    Aún no hay postulaciones.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}

export default ProjectView;