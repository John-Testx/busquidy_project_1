import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const Modal = ({ show, onClose, children, dismissOnClickOutside = false, size = "md" }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (show) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsMounted(false);
            onClose();
        }, 250);
    };

    const handleBackdropClick = (e) => {
        if (dismissOnClickOutside && e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!show && !isMounted) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-3xl",
        lg: "max-w-5xl",
        xl: "max-w-7xl",
        full: "max-w-full mx-4"
    };

    const modalContent = (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${
                isClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'
            }`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={handleBackdropClick}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden relative ${
                    isClosing ? 'modal-content-exit' : 'modal-content-enter'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:rotate-90"
                    aria-label="Cerrar modal"
                >
                    <X size={20} />
                </button>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[90vh]">
                    {children}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;