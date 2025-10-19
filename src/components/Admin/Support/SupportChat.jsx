import { useParams } from "react-router-dom";
import useSupportChat from "@/hooks/useSupportChat";

const SupportChat = () => {
  const { id_ticket } = useParams();
  
  const {
    messages,
    newMessage,
    loading,
    sending,
    error,
    sendMessage,
    updateNewMessage,
    handleKeyPress
  } = useSupportChat(id_ticket);

  /**
   * Determina la clase CSS según el remitente del mensaje
   * @param {string} remitente - Tipo de remitente (administrador o usuario)
   * @returns {Object} Clases CSS para el mensaje
   */
  const getMessageStyles = (remitente) => {
    const isAdmin = remitente === "administrador";
    return {
      containerClass: `mb-2 flex ${isAdmin ? "justify-end" : "justify-start"}`,
      bubbleClass: `p-2 rounded-lg max-w-xs ${
        isAdmin
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800"
      }`
    };
  };

  return (
    <div className="flex flex-col h-full bg-white shadow rounded-lg p-4">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4">
        Ticket #{id_ticket}
      </h2>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto border p-3 rounded-md mb-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-500 text-sm">Cargando mensajes...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 hover:underline text-sm"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No hay mensajes aún.</p>
        ) : (
          messages.map((msg) => {
            const { containerClass, bubbleClass } = getMessageStyles(msg.remitente);
            
            return (
              <div key={msg.id_mensaje} className={containerClass}>
                <div className={bubbleClass}>
                  <p className="text-sm">{msg.mensaje}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.fecha_envio).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Container */}
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => updateNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          disabled={sending}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !newMessage.trim()}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 min-w-[80px]"
        >
          {sending ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default SupportChat;