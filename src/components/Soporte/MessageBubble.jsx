import React from "react";
import { User, Shield } from "lucide-react";

function MessageBubble({ mensaje, isOwn, isAdmin }) {
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

  // Determinar el nombre a mostrar
  const getNombreRemitente = () => {
    if (isAdmin) {
      return mensaje.nombre_remitente || 'Soporte';
    } else if (isOwn) {
      return 'Tú';
    } else {
      return mensaje.nombre_remitente || 'Usuario';
    }
  };

  return (
    <div className={`flex gap-1.5 md:gap-2 lg:gap-3 mb-2 md:mb-3 lg:mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-md ${
        isAdmin
          ? 'bg-gradient-to-br from-red-500 to-orange-500'
          : 'bg-gradient-to-br from-blue-500 to-cyan-500'
      }`}>
        {isAdmin ? (
          <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
        ) : (
          <User className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
        )}
      </div>

      {/* Mensaje */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Nombre y hora */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 px-1">
          <span className={`text-[10px] md:text-xs lg:text-sm font-semibold ${
            isAdmin ? 'text-red-600' : 'text-blue-600'
          }`}>
            {getNombreRemitente()}
          </span>
          <span className="text-[9px] md:text-[10px] lg:text-xs text-gray-400">
            {formatDate(mensaje.fecha_envio)}
          </span>
        </div>

        {/* Burbuja del mensaje */}
        <div className={`px-2.5 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 rounded-2xl shadow-sm ${
          isOwn
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md'
            : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800 border border-gray-200 rounded-bl-md'
        }`}>
          <p className="text-[11px] md:text-xs lg:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {mensaje.mensaje}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;