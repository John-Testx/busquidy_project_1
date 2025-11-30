import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layouts/MainLayout";
import { getProjectById } from "@/api/projectsApi";
import { uploadDeliverable } from "@/api/deliverablesApi";
import DeliverablesList from "@/pages/Shared/DeliverablesList";
import LoadingScreen from "@/components/LoadingScreen";
import { ArrowLeft, Upload, FileText, CheckCircle, MessageSquare } from "lucide-react";
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
                    nombre_archivo: 'Entregable ' + new Date().toLocaleDateString() // Nombre generico o pedirlo
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
                setRefreshDeliverables(prev => prev + 1); // Recargar lista
            } catch (error) {
                Swal.fire('Error', 'No se pudo subir el entregable.', 'error');
            }
        }
    };

    if (loading) return <LoadingScreen />;
    if (!project) return <div>Proyecto no encontrado</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
                    {/* Header */}
                    <button onClick={() => navigate("/freelancer-profile/mis-trabajos")} className="flex items-center gap-2 text-[#07767c] font-medium mb-6 hover:underline">
                        <ArrowLeft size={20} /> Volver a Mis Trabajos
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna Izquierda: Detalles */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.titulo}</h1>
                                <p className="text-gray-600 mb-6 whitespace-pre-wrap">{project.descripcion}</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-500 block">Presupuesto</span>
                                        <span className="text-xl font-bold text-[#07767c]">${Number(project.presupuesto).toLocaleString('es-CL')}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-500 block">Estado</span>
                                        <span className="text-xl font-bold text-gray-800 capitalize">{project.estado_publicacion}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sección Entregables */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <FileText className="text-[#07767c]" /> Entregables y Avances
                                    </h2>
                                    {project.estado_publicacion !== 'finalizado' && (
                                        <button 
                                            onClick={handleUpload}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#066065] transition-colors shadow-sm"
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
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                                <button 
                                    onClick={() => navigate('/chat/0')} // Ajustar ID si es necesario
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    <MessageSquare size={18} /> Contactar Cliente
                                </button>
                            </div>

                            {project.estado_publicacion === 'finalizado' && (
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                                    <h3 className="font-bold text-emerald-800">Proyecto Finalizado</h3>
                                    <p className="text-sm text-emerald-600 mt-1">El cliente ha liberado el pago.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default ActiveProjectDetail;