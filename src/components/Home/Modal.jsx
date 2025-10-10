import React from "react";
// import "../../styles/Home/Modal.css";

function Modal({show, onClose, children, dismissOnClickOutside = true}) {
    if (!show) return null;
    
    const handleOverlayClick = (event) => {
        // Solo cerrar si se hace clic directamente en el overlay, no en sus hijos
        if (event.target === event.currentTarget && dismissOnClickOutside) {
            onClose();
        }
    };
    
    return (
        <div 
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-[500]" 
            onClick={handleOverlayClick}
        >
            <div className="bg-white w-[90%] max-w-[1100px] h-auto flex justify-between items-center shadow-[0_5px_15px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden z-[501] relative animate-[modalSlideIn_0.3s_ease-out]">
                {/* Botón X siempre visible */}
                <button 
                    className="absolute top-4 right-4 bg-transparent border-none text-3xl cursor-pointer hover:text-gray-700 transition-colors z-10 w-8 h-8 flex items-center justify-center leading-none text-gray-600"
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;