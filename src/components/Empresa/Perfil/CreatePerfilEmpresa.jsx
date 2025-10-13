import React, { useState } from "react";
import ModalCreatePerfilEmpresa from "./ModalCreatePerfilEmpresa.jsx";
import MessageModal from "../../MessageModal.jsx";

function CreatePerfilEmpresa({ userType, id_usuario }) {
    const [showModalCreatePerfilEmpresa, setShowModalCreatePerfilEmpresa] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');

    const openModalCreatePerfilEmpresa = () => {
        if (userType === 'empresa') {
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

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-teal-100 rounded-full p-6">
                            <i className="fas fa-building text-4xl text-teal-600"></i>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Completa tu Perfil
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Es hora de que tu empresa brille. Crea un perfil completo para atraer a los mejores jovenes talentos.
                    </p>

                    {/* Button */}
                    <button
                        onClick={openModalCreatePerfilEmpresa}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                        <i className="fas fa-plus-circle"></i>
                        Crear Perfil Ahora
                    </button>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-400 text-sm">o</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-teal-50 rounded-lg border border-teal-100 p-4">
                        <p className="text-sm text-teal-700">
                            <i className="fas fa-info-circle mr-2"></i>
                            Tu perfil te ayudará en darte a conocer y atraer
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showModalCreatePerfilEmpresa && (
                <ModalCreatePerfilEmpresa 
                    closeModal={() => setShowModalCreatePerfilEmpresa(false)} 
                    id_usuario={id_usuario}
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