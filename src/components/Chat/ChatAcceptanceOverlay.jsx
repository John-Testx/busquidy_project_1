import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { respondContactRequest } from '@/api/contactRequestApi';

const ChatAcceptanceOverlay = ({ solicitud, onAccept, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRespond = async (respuesta) => {
    setLoading(true);
    setError('');

    try {
      await respondContactRequest(solicitud.id_solicitud, { respuesta });
      
      if (respuesta === 'aceptada') {
        onAccept();
      } else {
        onReject();
      }
    } catch (err) {
      console.error('Error al responder solicitud:', err);
      setError('Error al procesar tu respuesta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border-2 border-[#07767c]/20 p-6 space-y-4">
        {/* Icono y título */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#07767c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Solicitud de Chat
          </h3>
          <p className="text-gray-600">
            Una empresa quiere iniciar una conversación contigo sobre tu postulación.
          </p>
        </div>

        {/* Información de la solicitud */}
        {solicitud.mensaje_solicitud && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Mensaje de la empresa:</p>
            <p className="text-gray-600">{solicitud.mensaje_solicitud}</p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleRespond('rechazada')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <XCircle size={20} />
                Rechazar
              </>
            )}
          </button>

          <button
            onClick={() => handleRespond('aceptada')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <CheckCircle size={20} />
                Aceptar Chat
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Al aceptar, podrás chatear libremente con la empresa.
        </p>
      </div>
    </div>
  );
};

export default ChatAcceptanceOverlay;