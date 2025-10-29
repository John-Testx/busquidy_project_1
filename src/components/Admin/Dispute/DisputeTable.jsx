import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  RefreshCw, 
  AlertTriangle, 
  X, 
  DollarSign,
  FileText,
  Building2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Scale
} from "lucide-react";
import { getDisputedProjects, refundProjectPayment } from "@/api/adminApi";
import MessageModal from "@/components/MessageModal";
import LoadingScreen from "@/components/LoadingScreen";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con degradado */}
        <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
          
          {/* Icono de advertencia */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full">
              <AlertTriangle size={48} className="text-white" />
            </div>
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-white text-center">
            Confirmar Reembolso
          </h3>
          <p className="text-white/90 text-sm text-center mt-2">
            Esta acción es irreversible
          </p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6">
          {/* Información del proyecto */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Proyecto</p>
                  <p className="text-sm font-semibold text-gray-800">{project?.titulo}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Empresa</p>
                  <p className="text-sm font-semibold text-gray-800">{project?.nombre_empresa}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Monto a reembolsar</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ${Number(project?.monto_retenido).toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de advertencia */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg">
            <p className="text-red-800 text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              Consecuencias de esta acción:
            </p>
            <ul className="text-red-700 text-sm space-y-1.5 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>El dinero será devuelto a la empresa</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>El proyecto será marcado como cancelado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>El freelancer no recibirá el pago</span>
              </li>
            </ul>
          </div>

          {/* Input de confirmación */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Para confirmar, escribe{" "}
              <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
                REEMBOLSAR
              </span>
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              placeholder="Escribe REEMBOLSAR"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all text-sm"
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-200">
                <AlertTriangle size={14} />
                {error}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium hover:scale-105 active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={inputValue.trim().toUpperCase() !== "REEMBOLSAR"}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 active:scale-95"
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
      
      fetchDisputes();
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

  const getProjectStatusStyles = (status) => {
    switch(status?.toLowerCase()) {
      case 'activo':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'pendiente':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'finalizado':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cancelado':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'sin publicar':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      'RETENIDO': {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: <Scale className="w-3.5 h-3.5" />
      },
      'LIBERADO': {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />
      },
      'REEMBOLSADO': {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <TrendingUp className="w-3.5 h-3.5" />
      }
    };
    return configs[status] || configs['RETENIDO'];
  };

  // Estadísticas
  const stats = {
    total: disputes.length,
    retenido: disputes.filter(d => d.estado_pago === 'RETENIDO').length,
    liberado: disputes.filter(d => d.estado_pago === 'LIBERADO').length,
    reembolsado: disputes.filter(d => d.estado_pago === 'REEMBOLSADO').length,
    totalMonto: disputes.reduce((sum, d) => sum + Number(d.monto_retenido || 0), 0)
  };

  if (processing) {
    return <LoadingScreen message="Procesando reembolso..." />;
  }

  if (loading) {
    return <LoadingScreen message="Cargando disputas..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500" />
          <p className="text-red-700 font-medium text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Total Proyectos</p>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Retenidos</p>
              <Scale className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.retenido}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-400">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Liberados</p>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.liberado}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-400">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Monto Total</p>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-emerald-600">
              ${stats.totalMonto.toLocaleString('es-CL')}
            </p>
          </div>
        </div>

        {/* Tabla / Cards */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Proyectos con Pago en Garantía
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Gestiona y procesa reembolsos de manera segura
                </p>
              </div>
              <button
                onClick={fetchDisputes}
                disabled={processing}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                <RefreshCw size={16} className={processing ? "animate-spin" : ""} />
                <span className="hidden md:inline">Actualizar</span>
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Monto
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
                {disputes.map((dispute, index) => {
                  const paymentConfig = getPaymentStatusConfig(dispute.estado_pago);
                  
                  return (
                    <tr 
                      key={dispute.id_proyecto} 
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-[#07767c]/5 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-[#07767c]">
                          #{dispute.id_proyecto}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <span className="text-sm text-gray-900 line-clamp-2 font-medium">
                          {dispute.titulo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {dispute.nombre_empresa || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {Number(dispute.monto_retenido).toLocaleString('es-CL')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${paymentConfig.bg} ${paymentConfig.text} ${paymentConfig.border}`}>
                          {paymentConfig.icon}
                          {dispute.estado_pago}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getProjectStatusStyles(dispute.estado_publicacion)}`}>
                          {dispute.estado_publicacion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dispute.estado_pago === 'RETENIDO' ? (
                          <button
                            disabled={processing}
                            onClick={() => openRefundModal(dispute)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                            title="Reembolsar a la empresa"
                          >
                            <AlertTriangle size={16} />
                            <span>Reembolsar</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                            {dispute.estado_pago === 'LIBERADO' ? (
                              <>
                                <CheckCircle2 size={16} className="text-green-500" />
                                Liberado
                              </>
                            ) : (
                              <>
                                <TrendingUp size={16} className="text-blue-500" />
                                Reembolsado
                              </>
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {disputes.map((dispute) => {
              const paymentConfig = getPaymentStatusConfig(dispute.estado_pago);
              
              return (
                <div
                  key={dispute.id_proyecto}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-lg font-bold text-[#07767c]">
                      #{dispute.id_proyecto}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${paymentConfig.bg} ${paymentConfig.text} ${paymentConfig.border}`}>
                      {paymentConfig.icon}
                      {dispute.estado_pago}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-3 line-clamp-2">
                    {dispute.titulo}
                  </h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{dispute.nombre_empresa || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-lg font-bold text-emerald-600">
                          ${Number(dispute.monto_retenido).toLocaleString('es-CL')}
                        </span>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${getProjectStatusStyles(dispute.estado_publicacion)}`}>
                        {dispute.estado_publicacion}
                      </span>
                    </div>
                  </div>

                  {dispute.estado_pago === 'RETENIDO' ? (
                    <button
                      disabled={processing}
                      onClick={() => openRefundModal(dispute)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm font-medium"
                    >
                      <AlertTriangle size={16} />
                      Reembolsar a la empresa
                    </button>
                  ) : (
                    <div className="text-center py-2 text-sm text-gray-500 font-medium">
                      {dispute.estado_pago === 'LIBERADO' ? '✅ Ya liberado al freelancer' : '💰 Ya reembolsado a la empresa'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {disputes.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No hay proyectos con pagos en garantía
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Los proyectos con disputas aparecerán aquí
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación */}
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