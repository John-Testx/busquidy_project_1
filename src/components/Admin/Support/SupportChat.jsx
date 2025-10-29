import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSupportChat } from "@/hooks";
import { getTicketDetails } from "@/api/supportApi"; // ← Necesitamos importar esto
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  MessageSquare,
  User,
  Shield,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";

const SupportChat = () => {
  const { id_ticket } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);
  const [ticketInfo, setTicketInfo] = useState(null); // ← NUEVO: Para guardar info del ticket
  const [loadingTicket, setLoadingTicket] = useState(true); // ← NUEVO
  
  const {
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
  } = useSupportChat(id_ticket);

  // ← NUEVO: Obtener información del ticket
  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        setLoadingTicket(true);
        const response = await getTicketDetails(id_ticket);
        setTicketInfo(response.data);
      } catch (err) {
        console.error("Error fetching ticket info:", err);
      } finally {
        setLoadingTicket(false);
      }
    };

    if (id_ticket) {
      fetchTicketInfo();
    }
  }, [id_ticket]);

  // ← NUEVO: Función para obtener el correo del usuario
  const getUserEmail = () => {
    if (!ticketInfo) return "Cargando...";
    return ticketInfo.email_contacto || ticketInfo.email_usuario || "Sin correo";
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldAutoScroll]);

  // Auto-focus en el input después de enviar
  useEffect(() => {
    if (!sending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sending, messages]);

  // Focus inicial al cargar el componente
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

  // Detectar si el usuario está haciendo scroll manual
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isAtBottom);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
            
            <div className="p-3 bg-gradient-to-br from-[#07767c] to-[#055a5f] rounded-xl shadow-lg">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Ticket #{id_ticket}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {loadingTicket ? "Cargando información..." : `Conversación con ${getUserEmail()}`}
              </p>
            </div>

            {/* Estado de conexión */}
            <div className="flex items-center gap-2">
              {isPolling ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700 hidden md:inline">
                    Actualizando automáticamente
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-red-700 hidden md:inline">
                    Desconectado
                  </span>
                </div>
              )}

              <button
                onClick={refreshMessages}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Recargar mensajes"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 md:p-6 bg-white"
          >
            {loading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-[#07767c] w-10 h-10" />
                  <p className="text-gray-500 text-sm font-medium">Cargando conversación...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center bg-red-50 border-l-4 border-red-500 p-6 rounded-xl max-w-md">
<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-red-700 font-medium mb-3">{error}</p>
                  <button
                    onClick={refreshMessages}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No hay mensajes aún</p>
                  <p className="text-gray-400 text-sm mt-1">Inicia la conversación con el usuario</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => {
                  const isAdmin = msg.remitente === "administrador";
                  const showDate = index === 0 || 
                    new Date(messages[index - 1].fecha_envio).toDateString() !== 
                    new Date(msg.fecha_envio).toDateString();

                  return (
                    <React.Fragment key={msg.id_mensaje}>
                      {/* Separador de fecha */}
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {formatDateHeader(msg.fecha_envio)}
                          </span>
                        </div>
                      )}

                      {/* Mensaje */}
                      <div className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isAdmin 
                            ? 'bg-gradient-to-br from-red-500 to-orange-600' 
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        }`}>
                          {isAdmin ? (
                            <Shield className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>

                        {/* Contenido del mensaje */}
                        <div className={`flex-1 max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                          {/* Nombre y hora */}
                          <div className={`flex items-center gap-2 mb-1 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-sm font-semibold text-gray-800">
                              {isAdmin ? 'Master Admin' : (loadingTicket ? 'Usuario' : getUserEmail())}
                            </span>
                            <span className="text-xs text-gray-500">
                              Hoy {formatTime(msg.fecha_envio)}
                            </span>
                          </div>

                          {/* Burbuja del mensaje */}
                          <div className={`rounded-2xl px-4 py-2.5 ${
                            isAdmin 
                              ? 'bg-gray-100 text-gray-800 rounded-tr-sm' 
                              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tl-sm'
                          } shadow-sm`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {msg.mensaje}
                            </p>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Scroll to bottom button */}
          {!shouldAutoScroll && messages.length > 0 && (
            <div className="absolute bottom-32 right-8 z-10">
              <button
                onClick={() => {
                  setShouldAutoScroll(true);
                  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110"
                title="Ir al final"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 md:p-6 bg-white">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => updateNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={sending || loading}
                className="flex-1 border-2 border-blue-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm transition-all"
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim() || loading}
                className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-3 rounded-full hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100"
                title="Enviar mensaje"
              >
                {sending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center mt-2">
              <p className="text-xs text-gray-500">
                Presiona <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold">Enter</kbd> para enviar, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold">Shift+Enter</kbd> para nueva línea
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;