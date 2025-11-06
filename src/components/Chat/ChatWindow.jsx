import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User } from 'lucide-react';
import ChatAcceptanceOverlay from './ChatAcceptanceOverlay';
import { useAuth } from '@/hooks';

const ChatWindow = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  otherUserEmail, 
  currentUserId,
  solicitudData,
  onBack 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showAcceptanceOverlay, setShowAcceptanceOverlay] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const { id_usuario } = useAuth();

  // ✅ VERIFICAR SI DEBE MOSTRAR EL OVERLAY DE ACEPTACIÓN
  useEffect(() => {
    if (solicitudData) {
      const isReceptor = solicitudData.id_receptor === id_usuario;
      const isPendiente = solicitudData.estado_solicitud === 'pendiente';
      const isChat = solicitudData.tipo_solicitud === 'chat';

      if (isReceptor && isPendiente && isChat) {
        setShowAcceptanceOverlay(true);
        setChatEnabled(false);
      } else if (solicitudData.estado_solicitud === 'aceptada') {
        setShowAcceptanceOverlay(false);
        setChatEnabled(true);
      } else if (solicitudData.estado_solicitud === 'rechazada') {
        setShowAcceptanceOverlay(false);
        setChatEnabled(false);
      }
    } else {
      // Si no hay solicitud, verificar si hay mensajes para habilitar el chat
      if (messages && messages.length > 0) {
        setChatEnabled(true);
        setShowAcceptanceOverlay(false);
      }
    }
  }, [solicitudData, id_usuario, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && chatEnabled) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleAccept = () => {
    setShowAcceptanceOverlay(false);
    setChatEnabled(true);
    // Recargar la página para actualizar los datos
    window.location.reload();
  };

  const handleReject = () => {
    setShowAcceptanceOverlay(false);
    setChatEnabled(false);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <User size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Selecciona una conversación para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      {/* ✅ OVERLAY DE ACEPTACIÓN (si aplica) */}
      {showAcceptanceOverlay && solicitudData && (
        <ChatAcceptanceOverlay 
          solicitud={solicitudData}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white p-4 flex items-center gap-3 shadow-lg">
        {/* Botón volver (móvil) */}
        <button 
          onClick={onBack}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <User size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{otherUserEmail}</h3>
          <p className="text-xs text-teal-100">
            {chatEnabled ? 'En línea' : 'Chat no disponible'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No hay mensajes aún. ¡Comienza la conversación!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.id_sender === currentUserId;
              return (
                <div
                  key={msg.id_message || index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="break-words">{msg.message_text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-teal-100' : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ✅ MENSAJE SI EL CHAT ESTÁ RECHAZADO */}
      {!chatEnabled && !showAcceptanceOverlay && (
        <div className="bg-red-50 border-t border-red-200 p-4 text-center">
          <p className="text-red-700 font-medium">
            Esta conversación no está disponible
          </p>
          <p className="text-sm text-red-600">
            La solicitud de chat fue rechazada
          </p>
        </div>
      )}

      {/* Input */}
      <form 
        onSubmit={handleSendMessage} 
        className={`p-4 bg-white border-t border-gray-200 ${!chatEnabled && 'opacity-50'}`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={chatEnabled ? "Escribe un mensaje..." : "Chat no disponible"}
            disabled={!chatEnabled}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !chatEnabled}
            className="px-6 py-2 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-full hover:from-[#055a5f] hover:to-[#077d84] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;