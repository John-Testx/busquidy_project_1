import React from 'react';
import { Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import { respondContactRequest } from '@/api/contactRequestApi'; // Asegúrate de tener esta función en tu API

const ChatAcceptanceOverlay = ({ solicitud, onAccept, onReject }) => {
  const [loading, setLoading] = React.useState(false);

  const handleResponse = async (respuesta) => {
    setLoading(true);
    try {
      // Llamada a tu endpoint: PUT /api/solicitudes/:id/responder
      await respondContactRequest(solicitud.id_solicitud, { respuesta });
      
      if (respuesta === 'aceptada') {
        onAccept();
      } else {
        onReject();
      }
    } catch (error) {
      console.error("Error al responder solicitud:", error);
      alert("Hubo un error al procesar tu respuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-[#07767c] p-6 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-bold">Solicitud de Chat</h3>
          <p className="text-teal-100 mt-1">La empresa quiere iniciar una conversación</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-800">
              Debes aceptar esta solicitud para poder enviar y recibir mensajes con <strong>{solicitud.nombre_empresa}</strong> sobre el proyecto <strong>{solicitud.nombre_proyecto}</strong>.
            </p>
          </div>

          {/* Mensaje de la empresa si existe */}
          {solicitud.mensaje_solicitud && (
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mensaje de la empresa:</p>
              <p className="text-gray-700 italic">"{solicitud.mensaje_solicitud}"</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleResponse('rechazada')}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Rechazar'}
            </button>
            
            <button
              onClick={() => handleResponse('aceptada')}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-[#07767c] text-white rounded-xl hover:bg-[#066065] font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (
                <>
                  <Check size={18} /> Aceptar Chat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAcceptanceOverlay;