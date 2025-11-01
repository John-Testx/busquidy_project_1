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
   * Mostrar notificación toast (usando notificaciones del navegador)
   */
  const showNotificationToast = useCallback((notificacion) => {
    // Crear notificación del navegador si tiene permisos
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nueva notificación - Busquidy', {
        body: notificacion.mensaje,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'busquidy-notification',
        requireInteraction: false,
      });
    }
    
    console.log('🔔 Nueva notificación:', notificacion.mensaje);
  }, []);

  /**
   * Solicitar permisos de notificación del navegador
   */
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('📢 Permiso de notificaciones:', permission);
      });
    }
  }, []);

  /**
   * Inicializar conexión Socket.IO
   */
  useEffect(() => {
    if (!isAuthenticated || !id_usuario) {
      // Limpiar estado si no está autenticado
      setNotifications([]);
      setUnreadCount(0);
      
      // Desconectar socket si existe
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    console.log('🔌 Intentando conectar Socket.IO para notificaciones...');
    console.log('📍 URL del servidor:', SOCKET_URL);
    console.log('👤 ID Usuario:', id_usuario);

    // Crear conexión
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // Registrar usuario para recibir notificaciones
    socketRef.current.on('connect', () => {
      console.log('✅ Socket conectado para notificaciones');
      console.log('📡 Socket ID:', socketRef.current.id);
      socketRef.current.emit('register_user', id_usuario);
    });

    // ✅ ESCUCHAR NUEVAS NOTIFICACIONES EN TIEMPO REAL
    socketRef.current.on('new_notification', (notificacion) => {
      console.log('🔔 Nueva notificación recibida en tiempo real:', notificacion);
      
      // Incrementar contador
      setUnreadCount(prev => {
        const newCount = prev + 1;
        console.log('📊 Contador actualizado:', newCount);
        return newCount;
      });
      
      // Agregar a la lista (al inicio para que se vea primero)
      setNotifications(prev => {
        const nuevaNotificacion = {
          id_notificacion: Date.now(), // Temporal hasta que se recargue
          tipo_notificacion: notificacion.tipo,
          mensaje: notificacion.mensaje,
          enlace: notificacion.enlace,
          leido: false,
          fecha_creacion: notificacion.fecha || new Date().toISOString()
        };
        
        console.log('📝 Agregando notificación a la lista');
        return [nuevaNotificacion, ...prev];
      });
      
      // Mostrar toast/notificación del navegador
      showNotificationToast(notificacion);
    });

    // Manejo de errores de conexión
    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error.message);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('🔌 Socket desconectado:', reason);
      if (reason === 'io server disconnect') {
        // El servidor forzó la desconexión, intentar reconectar manualmente
        socketRef.current.connect();
      }
    });

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconectado después de', attemptNumber, 'intentos');
      socketRef.current.emit('register_user', id_usuario);
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Intento de reconexión #', attemptNumber);
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('❌ Error en reconexión:', error.message);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('❌ Reconexión fallida después de todos los intentos');
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        console.log('🔌 Desconectando socket de notificaciones...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, id_usuario, showNotificationToast]);

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
      console.log('📊 Contador inicial de no leídas:', data.count);
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
      console.log('📥 Notificaciones cargadas:', data.notificaciones?.length || 0);
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
      console.log('✅ Notificación marcada como leída:', id_notificacion);
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
      console.log('✅ Todas las notificaciones marcadas como leídas');
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  }, []);

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