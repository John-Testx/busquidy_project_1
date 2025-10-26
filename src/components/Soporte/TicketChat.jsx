import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Send, Loader2 } from "lucide-react";

function TicketChat({ id_ticket, mensajes, onSendMessage, currentUserId, isPublic = false, guestEmail = null }) {
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mensajes.length > prevMessagesLengthRef.current && mensajes.length > 0) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = mensajes.length;
  }, [mensajes]);

  useEffect(() => {
    prevMessagesLengthRef.current = 0;
  }, [id_ticket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!nuevoMensaje.trim() || enviando) return;

    setEnviando(true);
    try {
      await onSendMessage(nuevoMensaje);
      setNuevoMensaje("");
     
      // CORRECCIÓN: Resetear altura y mantener foco
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        // Mantener el foco en el textarea después de enviar
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setNuevoMensaje(e.target.value);
   
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6 xl:p-8 space-y-2 md:space-y-3 lg:space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {mensajes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-3 md:px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-blue-100 rounded-full flex items-center justify-center mb-3 md:mb-4">
              <Send className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
            </div>
            <p className="text-gray-400 text-center text-xs md:text-sm lg:text-base font-medium">
              No hay mensajes aún
            </p>
            <p className="text-gray-400 text-center text-[10px] md:text-xs lg:text-sm mt-1">
              ¡Comienza la conversación escribiendo un mensaje!
            </p>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => {
              const isAdmin = msg.remitente === 'administrador';
              
              let isOwn = false;
              
              if (isPublic) {
                isOwn = !isAdmin;
              } else {
                if (isAdmin) {
                  isOwn = false;
                } else {
                  const msgUserId = String(msg.id_usuario);
                  const currUserId = String(currentUserId);
                  isOwn = msgUserId === currUserId;
                }
              }
              
              return (
                <MessageBubble
                  key={msg.id_mensaje}
                  mensaje={msg}
                  isOwn={isOwn}
                  isAdmin={isAdmin}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Formulario de envío */}
      <div className="border-t border-gray-200 bg-white p-2 md:p-3 lg:p-4 xl:p-6 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-1.5 md:gap-2 lg:gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={nuevoMensaje}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className="w-full px-2.5 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-xs md:text-sm lg:text-base placeholder-gray-400"
              rows="1"
              disabled={enviando}
              style={{ minHeight: "40px", maxHeight: "120px" }}
              autoFocus
            />
          </div>
         
          <button
            type="submit"
            disabled={!nuevoMensaje.trim() || enviando}
            className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 md:p-2.5 lg:p-3 xl:p-3.5 rounded-lg md:rounded-xl lg:rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:scale-100"
          >
            {enviando ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 animate-spin" />
            ) : (
              <Send className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            )}
          </button>
        </form>
        <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-400 mt-1 md:mt-2 text-center">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}

export default TicketChat;