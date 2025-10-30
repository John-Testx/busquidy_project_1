import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks';
import io from 'socket.io-client';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead 
} from '@/api/notificationApi';

const NotificationContext = createContext();

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export const NotificationProvider = ({ children }) => {
  const { id_usuario, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  /**
   * Inicializar conexión Socket.IO
   */
  useEffect(() => {
    if (!isAuthenticated || !id_usuario) return;

    // Crear conexión
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });

    // Registrar usuario para recibir notificaciones
    socketRef.current.on('connect', () => {
      console.log('✅ Socket conectado para notificaciones');
      socketRef.current.emit('register_user', id_usuario);
    });

    // Escuchar nuevas notificaciones
    socketRef.current.on('new_notification', (notificacion) => {
      console.log('🔔 Nueva notificación recibida:', notificacion);
      
      // Incrementar contador
      setUnreadCount(prev => prev + 1);
      
      // Agregar a la lista (si estamos viendo notificaciones)
      setNotifications(prev => [notificacion, ...prev]);
      
      // Opcional: Mostrar toast/alert
      showNotificationToast(notificacion);
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('❌ Socket desconectado');
      }
    };
  }, [isAuthenticated, id_usuario]);

  /**
   * Cargar contador inicial
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    fetchUnreadCount();
  }, [isAuthenticated]);

  /**
   * Obtener contador de no leídas
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Error al obtener contador:', err);
    }
  }, []);

  /**
   * Obtener todas las notificaciones
   */
  const fetchNotifications = useCallback(async (solo_no_leidas = false) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getNotifications(solo_no_leidas);
      setNotifications(data.notificaciones || []);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Marcar notificación como leída
   */
  const handleMarkAsRead = useCallback(async (id_notificacion) => {
    try {
      await markAsRead(id_notificacion);
      
      // Actualizar estado local
      setNotifications(prev =>
        prev.map(notif =>
          notif.id_notificacion === id_notificacion
            ? { ...notif, leido: true }
            : notif
        )
      );
      
      // Decrementar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  }, []);

  /**
   * Marcar todas como leídas
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      
      // Actualizar estado local
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, leido: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  }, []);

  /**
   * Mostrar toast de notificación (opcional)
   */
  const showNotificationToast = (notificacion) => {
    // Implementar con tu librería de toast preferida
    // Por ejemplo: toast.info(notificacion.mensaje)
    console.log('🔔 Toast:', notificacion.mensaje);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook para usar el contexto de notificaciones
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

export default useNotifications;