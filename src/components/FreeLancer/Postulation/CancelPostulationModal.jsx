import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CancelPostulationModal = ({ isOpen, onClose, postulation, onConfirm }) => {
    const [cancelText, setCancelText] = useState('');
    const [cancelError, setCancelError] = useState('');

    if (!isOpen || !postulation) return null;

    const handleConfirm = async () => {
        if (cancelText.toLowerCase().trim() !== 'cancelar') {
            setCancelError('Debes escribir "cancelar" para confirmar');
            return;
        }

        try {
            await onConfirm(postulation.id_postulacion);
            setCancelText('');
            setCancelError('');
        } catch (error) {
            setCancelError('Error al cancelar la postulación. Por favor, intenta nuevamente.');
        }
    };

    const handleClose = () => {
        setCancelText('');
        setCancelError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-[modalSlideIn_0.3s_ease-out]">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <X className="w-7 h-7 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Cancelar postulación
                        </h3>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        ¿Estás seguro que quieres cancelar tu postulación a:
                    </p>
                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 mb-4">
                        <p className="font-bold text-gray-900 mb-1">
                            {postulation.titulo}
                        </p>
                        <p className="text-sm text-gray-600">
                            {postulation.nombre_empresa}
                        </p>
                    </div>
                    
                    {/* Advertencia importante */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 font-medium">
                            <strong>Atención:</strong> Una vez cancelada, no podrás volver a postularte a esta oferta.
                        </p>
                    </div>

                    <p className="text-gray-700 font-medium mb-4">
                        Para confirmar, escribe <span className="font-bold text-[#078b91]">cancelar</span>
                    </p>
                    <input
                        type="text"
                        value={cancelText}
                        onChange={(e) => {
                            setCancelText(e.target.value);
                            setCancelError('');
                        }}
                        placeholder="Escribe: cancelar"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200"
                    />
                    {cancelError && (
                        <p className="text-rose-600 text-sm mt-2 font-medium">
                            {cancelError}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                        No, mantener
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all duration-200"
                    >
                        Sí, cancelar
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default CancelPostulationModal;