import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationIcon = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    handleMarkAsRead 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Cargar notificaciones recientes al abrir el dropdown
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(false); // Cargar todas
    }
  }, [isOpen, fetchNotifications]);

  // Filtrar solo las 7 más recientes
  useEffect(() => {
    const recent = notifications.slice(0, 7);
    setRecentNotifications(recent);
  }, [notifications]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Manejar clic en notificación
   */
  const handleNotificationClick = async (notificacion) => {
    // Marcar como leída
    if (!notificacion.leido) {
      await handleMarkAsRead(notificacion.id_notificacion);
    }

    // Cerrar dropdown
    setIsOpen(false);

    // Redirigir si tiene enlace
    if (notificacion.enlace) {
      navigate(notificacion.enlace);
    }
  };

  /**
   * Formatear fecha relativa
   */
  const formatRelativeTime = (fecha) => {
    try {
      return formatDistanceToNow(new Date(fecha), { 
        addSuffix: true, 
        locale: es 
      });
    } catch {
      return 'Hace un momento';
    }
  };

  /**
   * Obtener icono según tipo de notificación
   */
  const getNotificationIcon = (tipo) => {
    const iconMap = {
      nuevo_mensaje: '💬',
      postulacion_aceptada: '🎉',
      postulacion_rechazada: '❌',
      nueva_postulacion: '📝',
      pago_liberado: '💰',
      proyecto_finalizado: '✅',
      solicitud_chat_recibida: '💬',
      solicitud_entrevista_recibida: '📅',
      nueva_resena_recibida: '⭐',
      suscripcion_exitosa: '🎊',
      ticket_soporte_respondido: '🎫',
    };

    return iconMap[tipo] || '🔔';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icono de campanita */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-[#07767c] hover:bg-gray-50 rounded-lg transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        
        {/* Badge con contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  ({unreadCount} nuevas)
                </span>
              )}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto max-h-[400px]">
            {recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell size={48} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 text-center">
                  No tienes notificaciones
                </p>
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id_notificacion}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                    !notif.leido
                      ? 'bg-[#07767c]/5 hover:bg-[#07767c]/10'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Icono */}
                  <div className="flex-shrink-0 text-2xl">
                    {getNotificationIcon(notif.tipo_notificacion)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      !notif.leido ? 'font-semibold text-gray-800' : 'text-gray-700'
                    }`}>
                      {notif.mensaje}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(notif.fecha_creacion)}
                    </p>
                  </div>

                  {/* Indicador de no leído */}
                  {!notif.leido && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-[#07767c] rounded-full"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="w-full px-4 py-3 text-sm font-medium text-[#07767c] hover:bg-[#07767c]/5 transition-colors text-center"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;