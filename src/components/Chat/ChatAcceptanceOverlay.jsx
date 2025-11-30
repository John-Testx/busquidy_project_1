import React from 'react';
import { Check, X, MessageSquare, AlertCircle } from 'lucide-react';
import { respondContactRequest } from '@/api/contactRequestApi';

const ChatAcceptanceOverlay = ({ solicitud, onAccept, onReject }) => {
  const [loading, setLoading] = React.useState(false);

  const handleResponse = async (respuesta) => {
    setLoading(true);
    try {
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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#07767c] to-[#0a9199] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="w-20 h-20 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-lg relative z-10">
            <MessageSquare size={36} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold mb-2 relative z-10">Solicitud de Chat</h3>
          <p className="text-teal-50 text-sm relative z-10">La empresa quiere iniciar una conversación contigo</p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-5 mb-6 flex gap-3 shadow-sm">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={22} strokeWidth={2} />
            <div className="text-sm text-blue-900 leading-relaxed">
              <p className="mb-2">
                Debes aceptar esta solicitud para poder enviar y recibir mensajes.
              </p>
              <p className="font-semibold">
                Empresa: <span className="text-blue-700">{solicitud.nombre_empresa}</span>
              </p>
              <p className="font-semibold">
                Proyecto: <span className="text-blue-700">{solicitud.nombre_proyecto}</span>
              </p>
            </div>
          </div>

          {/* Mensaje de la empresa */}
          {solicitud.mensaje_solicitud && (
            <div className="mb-6 bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MessageSquare size={14} />
                Mensaje de la empresa:
              </p>
              <p className="text-gray-800 leading-relaxed">"{solicitud.mensaje_solicitud}"</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleResponse('rechazada')}
              disabled={loading}
              className="flex-1 py-3.5 px-5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X size={18} />
              {loading ? 'Procesando...' : 'Rechazar'}
            </button>
            
            <button
              onClick={() => handleResponse('aceptada')}
              disabled={loading}
              className="flex-1 py-3.5 px-5 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-xl hover:from-[#066065] hover:to-[#088890] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Check size={20} strokeWidth={2.5} />
                  Aceptar Chat
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