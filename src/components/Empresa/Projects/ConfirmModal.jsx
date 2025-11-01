import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-[modalSlideIn_0.3s_ease-out]">
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-5">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-800 text-lg mb-8 text-center font-medium">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Confirmar Eliminación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;