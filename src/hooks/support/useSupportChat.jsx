import { useState, useEffect, useCallback, useRef } from 'react';
import { getTicketMessages, sendTicketMessage } from '@/api/supportApi';

/**
 * Custom hook para gestionar el chat de soporte de un ticket con actualización en tiempo real
 * @param {string|number} id_ticket - ID del ticket
 * @returns {Object} Estado y funciones para gestionar el chat
 */
function useSupportChat(id_ticket) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  
  // Refs para evitar llamadas duplicadas
  const pollingIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const isMountedRef = useRef(true);

  /**
   * Obtiene los mensajes del ticket
   */
  const fetchMessages = useCallback(async (silent = false) => {
    if (!id_ticket) {
      setError("ID de ticket no válido");
      setLoading(false);
      return;
    }

    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
     
      const response = await getTicketMessages(id_ticket);
      
      if (isMountedRef.current) {
        const newMessages = response.data;
        
        // Solo actualizar si hay cambios en los mensajes
        if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
          setMessages(newMessages);
          lastMessageCountRef.current = newMessages.length;
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      if (isMountedRef.current && !silent) {
        setError("Error al cargar los mensajes");
      }
    } finally {
      if (isMountedRef.current && !silent) {
        setLoading(false);
      }
    }
  }, [id_ticket, messages]);

  /**
   * Envía un nuevo mensaje al ticket
   */
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
   
    try {
      setSending(true);
      setError(null);
     
      await sendTicketMessage(id_ticket, newMessage);
     
      // Limpiar el input
      setNewMessage("");
     
      // Recargar los mensajes inmediatamente
      await fetchMessages(true);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  }, [id_ticket, newMessage, fetchMessages]);

  /**
   * Actualiza el valor del mensaje nuevo
   */
  const updateNewMessage = useCallback((value) => {
    setNewMessage(value);
  }, []);

  /**
   * Maneja el envío del mensaje al presionar Enter
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  /**
   * Recarga los mensajes manualmente
   */
  const refreshMessages = useCallback(() => {
    fetchMessages(false);
  }, [fetchMessages]);

  /**
   * Inicia el polling para actualizaciones en tiempo real
   */
  const startPolling = useCallback(() => {
    setIsPolling(true);
    
    // Limpiar intervalo anterior si existe
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Polling cada 3 segundos (ajustable según necesidad)
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(true); // Silent fetch para no mostrar spinner
    }, 3000);
  }, [fetchMessages]);

  /**
   * Detiene el polling
   */
  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Carga inicial de mensajes y configuración del polling
  useEffect(() => {
    isMountedRef.current = true;
    
    fetchMessages(false);
    startPolling();

    // Cleanup al desmontar
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [id_ticket]); // Solo re-ejecutar si cambia el id_ticket

  // Pausar polling cuando la pestaña no está visible (optimización)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
        fetchMessages(true); // Refrescar al volver
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startPolling, stopPolling, fetchMessages]);

  return {
    messages,
    newMessage,
    loading,
    sending,
    error,
    isPolling,
    sendMessage,
    updateNewMessage,
    handleKeyPress,
    refreshMessages,
    startPolling,
    stopPolling
  };
}

export default useSupportChat;