import React from "react";
import { User, Shield } from "lucide-react";

function MessageBubble({ mensaje, isOwn }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (date.toDateString() === today.toDateString()) {
      return `Hoy ${timeStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ayer ${timeStr}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const isAdmin = mensaje.remitente === 'administrador';

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isAdmin 
          ? 'bg-gradient-to-br from-red-500 to-orange-500' 
          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
      }`}>
        {isAdmin ? (
          <Shield className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Mensaje */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Nombre y hora */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className={`text-sm font-semibold ${
            isAdmin ? 'text-red-600' : 'text-gray-700'
          }`}>
            {mensaje.nombre_remitente || (isAdmin ? 'Soporte' : 'Tú')}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(mensaje.fecha_envio)}
          </span>
        </div>

        {/* Burbuja del mensaje */}
        <div className={`px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
            : isAdmin
            ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border border-gray-300 rounded-tl-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {mensaje.mensaje}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;