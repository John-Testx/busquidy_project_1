import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Filter, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import MainLayout from "@/components/Layouts/MainLayout";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // Cargar notificaciones al montar
  useEffect(() => {
    fetchNotifications(false);
  }, [fetchNotifications]);

  /**
   * Filtrar notificaciones según el filtro seleccionado
   */
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.leido;
    if (filter === 'read') return notif.leido;
    return true;
  });

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
   * Obtener icono según tipo
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

  /**
   * Manejar clic en notificación
   */
  const handleNotificationClick = async (notificacion) => {
    if (!notificacion.leido) {
      await handleMarkAsRead(notificacion.id_notificacion);
    }

    if (notificacion.enlace) {
      navigate(notificacion.enlace);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <>
        <MainLayout >
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07767c]"></div>
        </div>
        </MainLayout >
      </>
    );
  }

  return (
    <>
      <MainLayout >
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Bell className="text-[#07767c]" size={32} />
                  Notificaciones
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {unreadCount > 0 ? (
                    <span>Tienes <strong>{unreadCount}</strong> notificación{unreadCount !== 1 ? 'es' : ''} sin leer</span>
                  ) : (
                    'No tienes notificaciones nuevas'
                  )}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchNotifications(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Actualizar
                </button>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#07767c] rounded-lg hover:bg-[#055a5f] transition-colors flex items-center gap-2"
                  >
                    <CheckCheck size={16} />
                    Marcar todo como leído
                  </button>
                )}
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === filterType
                      ? 'bg-[#07767c] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {filterType === 'all' && 'Todas'}
                  {filterType === 'unread' && 'No leídas'}
                  {filterType === 'read' && 'Leídas'}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Lista de notificaciones */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filter === 'unread' && 'No tienes notificaciones sin leer'}
                  {filter === 'read' && 'No tienes notificaciones leídas'}
                  {filter === 'all' && 'No tienes notificaciones'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id_notificacion}
                  onClick={() => handleNotificationClick(notif)}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md border-l-4 ${
                    !notif.leido
                      ? 'border-l-[#07767c] bg-[#07767c]/5'
                      : 'border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icono */}
                    <div className="flex-shrink-0 text-3xl">
                      {getNotificationIcon(notif.tipo_notificacion)}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        !notif.leido ? 'font-semibold text-gray-900' : 'text-gray-700'
                      }`}>
                        {notif.mensaje}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(notif.fecha_creacion)}
                        </p>
                        {!notif.leido && (
                          <span className="text-xs font-medium text-[#07767c] bg-[#07767c]/10 px-2 py-1 rounded">
                            Nueva
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </MainLayout >
    </>
  );
};

export default NotificationsPage;