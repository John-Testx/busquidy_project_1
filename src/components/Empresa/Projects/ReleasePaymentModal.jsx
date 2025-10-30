import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

const ReleasePaymentModal = ({ isOpen, onClose, onConfirm, project }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim().toUpperCase() !== "CONFIRMAR") {
      setError("Debes escribir exactamente 'CONFIRMAR' para proceder");
      return;
    }
    onConfirm();
    setInputValue("");
    setError("");
  };

  const handleClose = () => {
    setInputValue("");
    setError("");
    onClose();
  };

  const comision = project?.presupuesto * 0.10;
  const montoFreelancer = project?.presupuesto * 0.90;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6">
          {/* Icono de éxito */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-4 mx-auto">
            <CheckCircle size={48} />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-emerald-800 mb-3 text-center">
            Completar Proyecto y Liberar Pago
          </h3>

          {/* Información del proyecto */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Proyecto:</span> {project?.titulo}
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Monto total:</span>
                <span className="font-bold text-gray-900">
                  ${Number(project?.presupuesto).toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Comisión plataforma (10%):</span>
                <span className="font-bold text-amber-600">
                  -${Number(comision).toLocaleString('es-CL')}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Pago al freelancer:</span>
                <span className="font-bold text-emerald-600 text-lg">
                  ${Number(montoFreelancer).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>

          {/* Mensaje de advertencia */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4 rounded">
            <p className="text-emerald-800 text-sm font-medium mb-2">
              ✅ Al confirmar esta acción:
            </p>
            <ul className="text-emerald-700 text-sm space-y-1 list-disc list-inside">
              <li>El freelancer recibirá el pago acordado</li>
              <li>El proyecto será marcado como finalizado</li>
              <li>Esta acción <span className="font-bold">NO se puede deshacer</span></li>
            </ul>
          </div>

          {/* Input de confirmación */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Para confirmar, escribe <span className="text-emerald-600 font-bold">CONFIRMAR</span>:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="Escribe CONFIRMAR"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={inputValue.trim().toUpperCase() !== "CONFIRMAR"}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Liberar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleasePaymentModal;