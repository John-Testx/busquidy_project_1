import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User, Clock, AlertCircle } from 'lucide-react';
import ChatAcceptanceOverlay from './ChatAcceptanceOverlay';
import { useAuth } from '@/hooks';
import { MessageSquare } from 'lucide-react'; // También añade este

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
      if (messages && messages.length > 0) {
        setChatEnabled(true);
        setShowAcceptanceOverlay(false);
      }
    }
  }, [solicitudData, id_usuario, messages]);

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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User size={48} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Sin conversación seleccionada</h3>
          <p className="text-gray-500">Selecciona una conversación de la lista para comenzar a chatear</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white relative h-full">
      {showAcceptanceOverlay && solicitudData && (
        <ChatAcceptanceOverlay 
          solicitud={solicitudData}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-[#07767c] via-[#088890] to-[#0a9199] text-white px-4 py-4 flex items-center gap-3 shadow-lg relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <button 
          onClick={onBack}
          className="md:hidden p-2 hover:bg-white/20 rounded-xl transition-all duration-200 relative z-10"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>

        <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg relative z-10">
          <User size={24} strokeWidth={2} />
        </div>
        
        <div className="flex-1 relative z-10">
          <h3 className="font-bold text-lg">{otherUserEmail}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${chatEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <p className="text-xs text-teal-100 font-medium">
              {chatEnabled ? 'Disponible' : 'No disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area mejorada */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-white custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageSquare size={36} className="text-gray-500" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No hay mensajes aún</p>
              <p className="text-sm text-gray-400">¡Comienza la conversación!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwnMessage = msg.id_sender === currentUserId;
              return (
                <div
                  key={msg.id_message || index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-md ${
                      isOwnMessage
                        ? 'bg-gradient-to-br from-[#07767c] to-[#0a9199] text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="break-words leading-relaxed">{msg.message_text}</p>
                    <div className={`flex items-center gap-1 mt-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <Clock size={12} className={isOwnMessage ? 'text-teal-200' : 'text-gray-400'} />
                      <p className={`text-xs ${isOwnMessage ? 'text-teal-100' : 'text-gray-500'}`}>
                        {formatMessageTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Mensaje de chat rechazado */}
      {!chatEnabled && !showAcceptanceOverlay && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-t-2 border-red-200 p-4 text-center flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-red-700 font-bold">Conversación no disponible</p>
          </div>
          <p className="text-sm text-red-600">La solicitud de chat fue rechazada</p>
        </div>
      )}

      {/* Input mejorado */}
      <form 
        onSubmit={handleSendMessage} 
        className={`p-4 bg-white border-t border-gray-200 flex-shrink-0 ${!chatEnabled && 'opacity-50'}`}
      >
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={chatEnabled ? "Escribe tu mensaje..." : "Chat no disponible"}
            disabled={!chatEnabled}
            className="flex-1 px-5 py-3 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#07767c]/50 focus:border-[#07767c] focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 text-gray-800"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !chatEnabled}
            className="px-6 py-3 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-2xl hover:from-[#055a5f] hover:to-[#077d84] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
          >
            <Send size={20} strokeWidth={2} />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;