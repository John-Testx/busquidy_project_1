import React from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

function MessageModal({ message, closeModal, type = "info" }) {
    // Configuración de estilos según el tipo de mensaje
    const typeConfig = {
        success: {
            icon: <CheckCircle size={48} />,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            borderColor: "border-green-200",
            titleColor: "text-green-800",
            title: "¡Éxito!"
        },
        error: {
            icon: <AlertCircle size={48} />,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            borderColor: "border-red-200",
            titleColor: "text-red-800",
            title: "Error"
        },
        warning: {
            icon: <AlertTriangle size={48} />,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            borderColor: "border-amber-200",
            titleColor: "text-amber-800",
            title: "Atención"
        },
        info: {
            icon: <Info size={48} />,
            iconBg: "bg-[#07767c]/10",
            iconColor: "text-[#07767c]",
            borderColor: "border-[#07767c]/20",
            titleColor: "text-[#07767c]",
            title: "Información"
        }
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-200"
            onClick={closeModal}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con botón de cerrar */}
                <div className="relative px-6 pt-6">
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="px-6 pb-6 text-center">
                    {/* Icono */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 ${config.iconBg} ${config.iconColor} rounded-full mb-4 animate-in zoom-in duration-300`}>
                        {config.icon}
                    </div>

                    {/* Título */}
                    <h3 className={`text-2xl font-bold ${config.titleColor} mb-3`}>
                        {config.title}
                    </h3>

                    {/* Mensaje */}
                    <p className="text-gray-600 leading-relaxed text-base mb-6">
                        {message}
                    </p>

                    {/* Botón de acción */}
                    <button
                        onClick={closeModal}
                        className="w-full bg-gradient-to-r from-[#07767c] to-[#055a5f] hover:from-[#055a5f] hover:to-[#043d42] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MessageModal;