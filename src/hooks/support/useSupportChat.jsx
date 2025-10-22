import { useState, useEffect, useCallback } from 'react';
import { getTicketMessages, sendTicketMessage } from '@/api/supportApi';

/**
 * Custom hook para gestionar el chat de soporte de un ticket
 * @param {string|number} id_ticket - ID del ticket
 * @returns {Object} Estado y funciones para gestionar el chat
 */
function useSupportChat(id_ticket) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene los mensajes del ticket
   */
  const fetchMessages = useCallback(async () => {
    if (!id_ticket) {
      setError("ID de ticket no válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getTicketMessages(id_ticket);
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Error al cargar los mensajes");
    } finally {
      setLoading(false);
    }
  }, [id_ticket]);

  /**
   * Envía un nuevo mensaje al ticket
   */
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage);
    
    try {
      setSending(true);
      setError(null);
      
      await sendTicketMessage(id_ticket, newMessage);
      
      // Limpiar el input
      setNewMessage("");
      
      // Recargar los mensajes
      await fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  }, [id_ticket, newMessage, fetchMessages]);

  /**
   * Actualiza el valor del mensaje nuevo
   * @param {string} value - Nuevo valor del mensaje
   */
  const updateNewMessage = useCallback((value) => {
    setNewMessage(value);
  }, []);

  /**
   * Maneja el envío del mensaje al presionar Enter
   * @param {KeyboardEvent} e - Evento del teclado
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
    fetchMessages();
  }, [fetchMessages]);

  // Carga inicial de mensajes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    newMessage,
    loading,
    sending,
    error,
    sendMessage,
    updateNewMessage,
    handleKeyPress,
    refreshMessages
  };
}

export default useSupportChat;