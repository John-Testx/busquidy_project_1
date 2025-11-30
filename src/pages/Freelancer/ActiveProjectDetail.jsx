import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "@/api/projectsApi";
import { uploadDeliverable } from "@/api/deliverablesApi";
import DeliverablesList from "@/pages/Shared/DeliverablesList";
import LoadingScreen from "@/components/LoadingScreen";
import { ArrowLeft, Upload, FileText, CheckCircle, MessageSquare, Briefcase } from "lucide-react";
import Swal from 'sweetalert2';

const ActiveProjectDetail = () => {
    const { idProyecto } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshDeliverables, setRefreshDeliverables] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProjectById(idProyecto);
                setProject(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [idProyecto]);

    const handleUpload = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Subir Entregable',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="URL del archivo (Drive, Dropbox, etc)">' +
                '<textarea id="swal-input2" class="swal2-textarea" placeholder="Descripción o comentarios del avance"></textarea>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Subir',
            confirmButtonColor: '#07767c',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return {
                    archivo_url: document.getElementById('swal-input1').value,
                    descripcion: document.getElementById('swal-input2').value,
                    nombre_archivo: 'Entregable ' + new Date().toLocaleDateString()
                }
            }
        });

        if (formValues) {
            if (!formValues.archivo_url) {
                Swal.fire('Error', 'Debes incluir un enlace al archivo', 'error');
                return;
            }

            try {
                await uploadDeliverable(idProyecto, formValues);
                Swal.fire('¡Subido!', 'Tu entregable se ha registrado.', 'success');
                setRefreshDeliverables(prev => prev + 1);
            } catch (error) {
                Swal.fire('Error', 'No se pudo subir el entregable.', 'error');
            }
        }
    };

    if (loading) return <LoadingScreen />;
    if (!project) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600 text-lg">Proyecto no encontrado</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header estandarizado con botón de regreso */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate("/freelancer-profile/mis-trabajos")} 
                        className="flex items-center gap-2 text-[#07767c] hover:text-[#05595d] font-semibold mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} /> Volver a Mis Trabajos
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#07767c] to-[#05595d] rounded-xl flex items-center justify-center">
                            <Briefcase className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{project.titulo}</h1>
                            <p className="text-gray-600">Detalles del proyecto</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Izquierda: Detalles */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción del Proyecto</h2>
                            <p className="text-gray-600 mb-6 whitespace-pre-wrap leading-relaxed">{project.descripcion}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-[#07767c]/10 to-[#40E0D0]/10 rounded-xl border border-[#07767c]/20">
                                    <span className="text-sm text-gray-600 block mb-1">Presupuesto</span>
                                    <span className="text-2xl font-bold text-[#07767c]">
                                        ${Number(project.presupuesto).toLocaleString('es-CL')}
                                    </span>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border border-gray-300">
                                    <span className="text-sm text-gray-600 block mb-1">Estado</span>
                                    <span className="text-2xl font-bold text-gray-900 capitalize">
                                        {project.estado_publicacion}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sección Entregables */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="text-[#07767c]" /> 
                                    Entregables y Avances
                                </h2>
                                {project.estado_publicacion !== 'finalizado' && (
                                    <button 
                                        onClick={handleUpload}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#05595d] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <Upload size={18} /> Nuevo Entregable
                                    </button>
                                )}
                            </div>
                            <DeliverablesList idProject={idProyecto} refreshTrigger={refreshDeliverables} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Acciones Rápidas</h3>
                            <button 
                                onClick={() => navigate('/chat/0')}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <MessageSquare size={18} /> Contactar Cliente
                            </button>
                        </div>

                        {project.estado_publicacion === 'finalizado' && (
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 p-6 text-center">
                                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                                <h3 className="font-bold text-emerald-900 text-lg mb-1">Proyecto Finalizado</h3>
                                <p className="text-sm text-emerald-700">El cliente ha liberado el pago.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveProjectDetail;