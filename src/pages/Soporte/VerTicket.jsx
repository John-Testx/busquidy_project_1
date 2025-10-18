import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import TicketChat from "@/components/Soporte/TicketChat";
import { 
  getTicketDetails, 
  getTicketMessages, 
  sendTicketMessage 
} from "@/api/supportApi";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Tag, 
  AlertTriangle,
  CheckCircle,
  Loader2 
} from "lucide-react";

function VerTicket() {
  const { id_ticket } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el token y usuario del localStorage
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    cargarTicket();
    cargarMensajes();

    // Actualizar mensajes cada 10 segundos
    const interval = setInterval(() => {
      cargarMensajes();
    }, 10000);

    return () => clearInterval(interval);
  }, [id_ticket]);

  const cargarTicket = async () => {
    try {
      const response = await getTicketDetails(id_ticket, token);
      setTicket(response.data);
    } catch (err) {
      console.error("Error al cargar ticket:", err);
      setError("No se pudo cargar el ticket");
    }
  };

  const cargarMensajes = async () => {
    try {
      const response = await getTicketMessages(id_ticket, token);
      setMensajes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
      setError("No se pudieron cargar los mensajes");
      setLoading(false);
    }
  };

  const handleSendMessage = async (mensaje) => {
    try {
      await sendTicketMessage(id_ticket, mensaje, token);
      await cargarMensajes();
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      throw err;
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        icon: <Clock className="w-4 h-4" />,
        label: "Pendiente"
      },
      "en proceso": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        label: "En Proceso"
      },
      resuelto: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Resuelto"
      },
      cerrado: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Cerrado"
      }
    };

    const badge = badges[estado] || badges.pendiente;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getPrioridadBadge = (prioridad) => {
    const badges = {
      baja: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <AlertTriangle className="w-4 h-4" />
      },
      media: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <AlertTriangle className="w-4 h-4" />
      },
      alta: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <AlertTriangle className="w-4 h-4" />
      }
    };

    const badge = badges[prioridad] || badges.media;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {prioridad?.charAt(0).toUpperCase() + prioridad?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando ticket...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !ticket) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || "Ticket no encontrado"}</p>
            <button
              onClick={() => navigate("/soporte")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/soportehome")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a tickets
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {ticket.asunto}
                  </h1>
                  <div className="flex flex-wrap gap-3 items-center">
                    {getEstadoBadge(ticket.estado)}
                    {getPrioridadBadge(ticket.prioridad)}
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      {ticket.categoria}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">Ticket #{ticket.id_ticket}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Creado: {new Date(ticket.fecha_creacion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {ticket.nombre_admin && (
                    <p className="text-blue-600 font-semibold">
                      Asignado a: {ticket.nombre_admin}
                    </p>
                  )}
                </div>
              </div>

              {ticket.estado === 'cerrado' && (
                <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Nota:</strong> Este ticket está cerrado. No se pueden enviar más mensajes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 400px)", minHeight: "500px" }}>
            <TicketChat
              id_ticket={id_ticket}
              mensajes={mensajes}
              onSendMessage={handleSendMessage}
              currentUserId={usuario.id_usuario || usuario.id}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default VerTicket;