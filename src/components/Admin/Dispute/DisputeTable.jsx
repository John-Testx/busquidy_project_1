import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw, AlertTriangle, X } from "lucide-react";
import { getDisputedProjects, refundProjectPayment } from "@/api/adminApi";
import MessageModal from "@/components/MessageModal";

// Modal de confirmación con input de texto
const RefundConfirmModal = ({ isOpen, onClose, onConfirm, project }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue.trim().toUpperCase() !== "REEMBOLSAR") {
      setError("Debes escribir exactamente 'REEMBOLSAR' para confirmar");
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
          {/* Icono de advertencia */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-4 mx-auto">
            <AlertTriangle size={48} />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-red-800 mb-3 text-center">
            Confirmar Reembolso
          </h3>

          {/* Información del proyecto */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Proyecto:</span> {project?.titulo}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Empresa:</span> {project?.nombre_empresa}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Monto a reembolsar:</span>{" "}
              <span className="text-emerald-600 font-bold text-lg">
                ${Number(project?.monto_retenido).toLocaleString('es-CL')}
              </span>
            </p>
          </div>

          {/* Mensaje de advertencia */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <p className="text-red-800 text-sm font-medium">
              ⚠️ Esta acción es <span className="font-bold">IRREVERSIBLE</span>
            </p>
            <ul className="text-red-700 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>El dinero será devuelto a la empresa</li>
              <li>El proyecto será marcado como cancelado</li>
              <li>El freelancer no recibirá el pago</li>
            </ul>
          </div>

          {/* Input de confirmación */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Para confirmar, escribe <span className="text-red-600 font-bold">REEMBOLSAR</span>:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="Escribe REEMBOLSAR"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <AlertTriangle size={14} />
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
              disabled={inputValue.trim().toUpperCase() !== "REEMBOLSAR"}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Reembolso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DisputeTable() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messageModal, setMessageModal] = useState({ show: false, message: "", type: "info" });

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await getDisputedProjects();
      setDisputes(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar disputas");
    } finally {
      setLoading(false);
    }
  };

  const openRefundModal = (dispute) => {
    setSelectedProject(dispute);
    setRefundModalOpen(true);
  };

  const handleRefund = async () => {
    try {
      setProcessing(true);
      setRefundModalOpen(false);
      
      await refundProjectPayment(selectedProject.id_proyecto);
      
      setMessageModal({
        show: true,
        message: `El reembolso de $${Number(selectedProject.monto_retenido).toLocaleString('es-CL')} fue procesado exitosamente. La empresa recibirá el dinero y el proyecto "${selectedProject.titulo}" ha sido cancelado.`,
        type: "success"
      });
      
      fetchDisputes(); // Recargar la lista
    } catch (err) {
      setMessageModal({
        show: true,
        message: err.response?.data?.error || "Error al procesar el reembolso. Por favor, intenta nuevamente.",
        type: "error"
      });
    } finally {
      setProcessing(false);
      setSelectedProject(null);
    }
  };

  // Función para obtener estilos según el estado del proyecto
  const getProjectStatusStyles = (status) => {
    switch(status?.toLowerCase()) {
      case 'activo':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      case 'pendiente':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'finalizado':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'sin publicar':
        return 'bg-gray-100 text-gray-700 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2 text-[#07767c]" size={32} />
        <span className="text-lg">Cargando disputas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Gestión de Disputas y Reembolsos
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {disputes.length} proyecto{disputes.length !== 1 ? 's' : ''} con pago en garantía
              </p>
            </div>
            <button
              onClick={fetchDisputes}
              disabled={processing}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={16} className={processing ? "animate-spin" : ""} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID Proyecto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monto Retenido
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado Pago
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado Proyecto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {disputes.map((dispute, index) => (
                <tr 
                  key={dispute.id_proyecto} 
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-[#07767c]/5 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      #{dispute.id_proyecto}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 line-clamp-2 font-medium">
                      {dispute.titulo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {dispute.nombre_empresa || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-emerald-600">
                      ${Number(dispute.monto_retenido).toLocaleString('es-CL')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      dispute.estado_pago === 'RETENIDO' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                      dispute.estado_pago === 'LIBERADO' ? 'bg-green-100 text-green-700 border border-green-300' :
                      dispute.estado_pago === 'REEMBOLSADO' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                      'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}>
                      {dispute.estado_pago}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getProjectStatusStyles(dispute.estado_publicacion)}`}>
                      {dispute.estado_publicacion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dispute.estado_pago === 'RETENIDO' ? (
                      <button
                        disabled={processing}
                        onClick={() => openRefundModal(dispute)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                        title="Reembolsar a la empresa"
                      >
                        <AlertTriangle size={16} />
                        <span>Reembolsar</span>
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 italic">
                        {dispute.estado_pago === 'LIBERADO' ? '✅ Ya liberado' : '💰 Ya reembolsado'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {disputes.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No hay proyectos con pagos en garantía</p>
          </div>
        )}
      </div>

      {/* Modal de confirmación de reembolso */}
      <RefundConfirmModal
        isOpen={refundModalOpen}
        onClose={() => {
          setRefundModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleRefund}
        project={selectedProject}
      />

      {/* Modal de mensajes */}
      {messageModal.show && (
        <MessageModal
          message={messageModal.message}
          type={messageModal.type}
          closeModal={() => setMessageModal({ show: false, message: "", type: "info" })}
        />
      )}
    </>
  );
}