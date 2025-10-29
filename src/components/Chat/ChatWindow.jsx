import React, { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Phone, Video, Info, ArrowLeft } from 'lucide-react';

const ChatWindow = ({ conversation, messages, onSendMessage, otherUserEmail, currentUserId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && messages.length > 0) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    prevMessagesLengthRef.current = 0;
  }, [conversation?.id_conversation]);

  if (!conversation) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#07767c]/20 to-[#0a9199]/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-[#07767c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Bienvenido a Mensajes</h3>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            Selecciona una conversación de la lista o inicia una nueva para comenzar a chatear con otros usuarios.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white w-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#07767c] to-[#0a9199] border-b border-[#055a5f] shadow-md">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          {/* Botón de retroceso solo en móvil */}
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-white text-base md:text-lg ring-2 ring-white/30">
              {otherUserEmail?.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-emerald-400 border-2 border-[#07767c] rounded-full"></span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white text-sm md:text-lg truncate">{otherUserEmail}</h2>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              En línea
            </p>
          </div>
        </div>

        {/* Action buttons - Solo algunos visibles en móvil */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button className="hidden sm:block p-2 md:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Llamada de voz">
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
          <button className="hidden sm:block p-2 md:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Videollamada">
            <Video className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
          <button className="hidden md:block p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Información">
            <Info className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 md:p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Más opciones">
            <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-3 md:p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-3 md:space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <p className="text-gray-400 text-xs md:text-sm text-center">No hay mensajes aún. ¡Inicia la conversación!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.id_sender === currentUserId;
            const showAvatar = index === 0 || messages[index - 1]?.id_sender !== msg.id_sender;
            
            return (
              <div key={msg.id_message} className={`flex items-end gap-1.5 md:gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {!isOwnMessage && showAvatar && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-700 text-xs flex-shrink-0">
                    {otherUserEmail?.charAt(0).toUpperCase()}
                  </div>
                )}
                {!isOwnMessage && !showAvatar && <div className="w-6 md:w-8" />}
                
                <div className={`max-w-[75%] sm:max-w-xs md:max-w-md ${isOwnMessage ? '' : 'order-2'}`}>
                  <div className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-sm ${
                    isOwnMessage 
                      ? 'bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-br-md' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}>
                    <p className="text-xs md:text-sm leading-relaxed break-words">{msg.message_text}</p>
                  </div>
                  <span className={`block text-[10px] md:text-xs mt-1 ${isOwnMessage ? 'text-right text-gray-500' : 'text-left text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-3 md:px-6 py-3 md:py-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="w-full pl-3 md:pl-4 pr-3 md:pr-12 py-2.5 md:py-3.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:border-[#07767c] focus:bg-white transition-all text-sm md:text-base text-gray-800 placeholder-gray-400"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2.5 md:p-3.5 bg-gradient-to-r from-[#07767c] to-[#0a9199] text-white rounded-xl hover:from-[#055a5f] hover:to-[#077d84] focus:outline-none focus:ring-2 focus:ring-[#07767c]/30 focus:ring-offset-2 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center flex-shrink-0"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;