import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketChat from "@/components/Soporte/TicketChat";
import { getTicketDetails, getTicketMessages, sendTicketMessage } from "@/api/supportApi";
import { ArrowLeft, Clock, User, Tag, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import MainLayout from '@/components/Layouts/MainLayout';
import LoadingScreen from "@/components/LoadingScreen";

function VerTicket() {
  const { id_ticket } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = sessionStorage.getItem("token");
  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    cargarTicket();
    cargarMensajes();

    const interval = setInterval(() => {
      cargarMensajes();
    }, 10000);

    return () => clearInterval(interval);
  }, [id_ticket]);

  const cargarTicket = async () => {
    try {
      const response = await getTicketDetails(id_ticket, token);
      setTicket(response.data);
      
      if (response.data.id_usuario) {
        setCurrentUserId(response.data.id_usuario);
      }
    } catch (err) {
      console.error("Error al cargar ticket:", err);
      setError("No se pudo cargar el ticket");
    }
  };

  const cargarMensajes = async () => {
    try {
      const response = await getTicketMessages(id_ticket, token);
      setMensajes(response.data);
      
      if (!currentUserId && response.data.length > 0) {
        const primerMensajeUsuario = response.data.find(m => m.remitente === 'usuario');
        if (primerMensajeUsuario && primerMensajeUsuario.id_usuario) {
          setCurrentUserId(primerMensajeUsuario.id_usuario);
        }
      }
      
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
        icon: <Clock className="w-3 h-3 md:w-4 md:h-4" />,
        label: "Pendiente"
      },
      "en proceso": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        icon: <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />,
        label: "En Proceso"
      },
      resuelto: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        icon: <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />,
        label: "Resuelto"
      },
      cerrado: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />,
        label: "Cerrado"
      }
    };

    const badge = badges[estado] || badges.pendiente;

    return (
      <span className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
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
        icon: <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
      },
      media: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
      },
      alta: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
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

  if (loading) return <LoadingScreen />;

  if (error || !ticket) {
    return (
      <MainLayout fullHeight>
        <div className="h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4 text-sm md:text-base">{error || "Ticket no encontrado"}</p>
            <button
              onClick={() => navigate("/soportehome")}
              className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm md:text-base"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout fullHeight noPadding>
      <div className="fixed inset-0 flex flex-col">
        {/* Espaciador para navbar */}
        <div className="h-16 md:h-20 flex-shrink-0"></div>

        {/* Contenedor principal */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
          {/* Header - scrolleable en móvil si es necesario */}
          <div className="flex-shrink-0 overflow-y-auto">
            <div className="container mx-auto px-3 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6 max-w-7xl">
              <button
                onClick={() => navigate("/soportehome")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2 md:mb-3 lg:mb-4 transition-colors text-sm md:text-base group"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                Volver a tickets
              </button>

              <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 border border-gray-200/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 md:gap-3 lg:gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-1.5 md:mb-2 lg:mb-3 break-words">
                      {ticket.asunto}
                    </h1>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 lg:gap-3 items-center">
                      {getEstadoBadge(ticket.estado)}
                      {getPrioridadBadge(ticket.prioridad)}
                      <span className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                        <Tag className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate max-w-[100px] md:max-w-none">{ticket.categoria}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm text-gray-500 space-y-0.5 md:space-y-1 flex-shrink-0 lg:text-right">
                    <p className="flex lg:justify-end items-center gap-1.5 md:gap-2">
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="font-semibold">Ticket #{ticket.id_ticket}</span>
                    </p>
                    <p className="flex lg:justify-end items-center gap-1.5 md:gap-2">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-[10px] md:text-xs lg:text-sm">{new Date(ticket.fecha_creacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </p>
                    {ticket.nombre_admin && (
                      <p className="text-blue-600 font-semibold text-[10px] md:text-xs lg:text-sm">
                        Asignado a: {ticket.nombre_admin}
                      </p>
                    )}
                  </div>
                </div>

                {ticket.estado === 'cerrado' && (
                  <div className="mt-2 md:mt-3 lg:mt-4 p-2 md:p-3 lg:p-4 bg-gray-100 border border-gray-300 rounded-lg">
                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-700">
                      <strong>Nota:</strong> Este ticket está cerrado. No se pueden enviar más mensajes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat - ocupa todo el espacio restante */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="container mx-auto px-3 md:px-6 lg:px-8 h-full max-w-7xl">
              <div className="h-full bg-white rounded-t-lg md:rounded-t-xl lg:rounded-t-2xl shadow-xl border border-b-0 border-gray-200/50 overflow-hidden">
                <TicketChat
                  id_ticket={id_ticket}
                  mensajes={mensajes}
                  onSendMessage={handleSendMessage}
                  currentUserId={currentUserId}
                  isPublic={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default VerTicket;