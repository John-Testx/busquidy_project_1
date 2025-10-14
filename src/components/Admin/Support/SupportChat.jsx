import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SupportChat = () => {
  const { id_ticket } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/support/${id_ticket}/mensajes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    console.log("Sending message:", newMessage);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/support/${id_ticket}/mensajes`,
        { mensaje: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchMessages(); // refresh chat
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id_ticket]);

  return (
    <div className="flex flex-col h-full bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Ticket #{id_ticket}</h2>

      <div className="flex-1 overflow-y-auto border p-3 rounded-md mb-3">
        {messages.length === 0 ? (
          <p className="text-gray-500">No hay mensajes aún.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id_mensaje}
              className={`mb-2 flex ${msg.remitente === "administrador" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.remitente === "administrador"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.mensaje}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.fecha_envio).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default SupportChat;
