import React from "react";
import { X } from "lucide-react";

function Modal({ show, onClose, children, dismissOnClickOutside = true, size = "lg" }) {
    if (!show) return null;

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget && dismissOnClickOutside) {
            onClose();
        }
    };

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-5xl",
        xl: "max-w-6xl"
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[2000] p-4 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
        >
            <div 
                className={`bg-white ${sizeClasses[size]} w-full rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón X mejorado */}
                <button
                    className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 bg-white/80 hover:bg-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:rotate-90 group"
                    onClick={onClose}
                >
                    <X size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;