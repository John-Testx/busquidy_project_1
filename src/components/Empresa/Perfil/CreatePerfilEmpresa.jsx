import React, { useState } from "react";
import ModalCreatePerfilEmpresa from "./ModalCreatePerfilEmpresa.jsx";
import MessageModal from "@/components/MessageModal.jsx";
import { Building2, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

function CreatePerfilEmpresa({ userType, id_usuario, onProfileCreated }) {
    const [showModalCreatePerfilEmpresa, setShowModalCreatePerfilEmpresa] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');

    const openModalCreatePerfilEmpresa = () => {
        console.log(userType);
        
        if (userType === 'empresa' || userType === 'empresa_juridico' || userType === 'empresa_natural') {
            setShowModalCreatePerfilEmpresa(true);
            console.log('id:', id_usuario);
        } else if (userType === 'freelancer') {
            setMessage('Esta función es exclusiva para usuarios de tipo Empresa.');
            setShowMessageModal(true);
        } else {
            setMessage('Debes iniciar sesión como Empresa para desbloquear esta función.');
            setShowMessageModal(true);
        }
    };
   
    const closeMessageModal = () => {
        setShowMessageModal(false);
    };

    const benefits = [
        { icon: "🎯", text: "Atrae talento joven calificado" },
        { icon: "⚡", text: "Publica proyectos ilimitados" },
        { icon: "📊", text: "Gestiona candidatos fácilmente" },
        { icon: "🌟", text: "Aumenta tu visibilidad" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-4xl">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    
                    {/* Header con gradiente */}
                    <div className="bg-gradient-to-r from-[#07767c] to-[#40E0D0] px-8 py-12 text-center relative overflow-hidden">
                        {/* Elementos decorativos */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                                <Building2 className="text-white" size={40} />
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-3">
                                Completa tu Perfil Empresarial
                            </h1>
                            <p className="text-white/90 text-lg max-w-2xl mx-auto">
                                Crea un perfil completo para conectar con los mejores jóvenes talentos
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-10">
                        {/* Beneficios en grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100"
                                >
                                    <span className="text-2xl">{benefit.icon}</span>
                                    <span className="text-gray-700 font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Botón principal */}
                        <button
                            onClick={openModalCreatePerfilEmpresa}
                            className="w-full bg-gradient-to-r from-[#07767c] to-[#40E0D0] hover:from-[#055a5f] hover:to-[#07767c] text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3 group"
                        >
                            <Sparkles size={24} />
                            <span className="text-lg">Crear Mi Perfil Ahora</span>
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Divider */}
                        <div className="my-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-gray-400 text-sm font-medium">Proceso rápido</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        {/* Pasos del proceso */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { step: "1", title: "Datos de Empresa", time: "2 min" },
                                { step: "2", title: "Representante Legal", time: "1 min" },
                                { step: "3", title: "¡Listo!", time: "Instantáneo" }
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-600 font-bold rounded-full mb-3">
                                        {item.step}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.time}</p>
                                </div>
                            ))}
                        </div>

                        {/* Info adicional */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="text-white" size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Tu información está segura</h4>
                                    <p className="text-sm text-gray-600">
                                        Todos tus datos están protegidos y solo serán utilizados para conectarte con talento calificado
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showModalCreatePerfilEmpresa && (
                <ModalCreatePerfilEmpresa 
                    closeModal={() => setShowModalCreatePerfilEmpresa(false)} 
                    id_usuario={id_usuario}
                    onProfileCreated={onProfileCreated}
                />
            )}

            {showMessageModal && (
                <MessageModal 
                    message={message} 
                    closeModal={closeMessageModal} 
                />
            )}
        </div>
    );
}

export default CreatePerfilEmpresa;