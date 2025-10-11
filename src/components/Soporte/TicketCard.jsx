import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  ChevronRight 
} from "lucide-react";

function TicketCard({ ticket, isPublic = false, guestEmail = null }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isPublic && guestEmail) {
      navigate(`/soporte/ticket-publico/${ticket.id_ticket}?email=${guestEmail}`);
    } else {
      navigate(`/soporte/ticket/${ticket.id_ticket}`);
    }
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      pendiente: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
        label: "Pendiente",
        dot: "bg-yellow-400"
      },
      "en proceso": {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        label: "En Proceso",
        dot: "bg-blue-400"
      },
      resuelto: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Resuelto",
        dot: "bg-green-400"
      },
      cerrado: {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-800",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Cerrado",
        dot: "bg-gray-400"
      }
    };

    return configs[estado] || configs.pendiente;
  };

  const getPrioridadConfig = (prioridad) => {
    const configs = {
      baja: {
        icon: <AlertTriangle className="w-3 h-3" />,
        text: "text-green-600",
        bg: "bg-green-100",
        label: "Baja"
      },
      media: {
        icon: <AlertTriangle className="w-3 h-3" />,
        text: "text-yellow-600",
        bg: "bg-yellow-100",
        label: "Media"
      },
      alta: {
        icon: <AlertTriangle className="w-3 h-3" />,
        text: "text-red-600",
        bg: "bg-red-100",
        label: "Alta"
      }
    };

    return configs[prioridad] || configs.media;
  };

  const estadoConfig = getEstadoConfig(ticket.estado);
  const prioridadConfig = getPrioridadConfig(ticket.prioridad);

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hoy";
    } else if (diffDays === 1) {
      return "Ayer";
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 overflow-hidden"
    >
      {/* Header con estado y prioridad */}
      <div className={`p-4 border-b-2 ${estadoConfig.border} ${estadoConfig.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${estadoConfig.dot} animate-pulse`}></div>
            <span className={`text-sm font-semibold ${estadoConfig.text} flex items-center gap-1`}>
              {estadoConfig.icon}
              {estadoConfig.label}
            </span>
          </div>
          
          <span className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${prioridadConfig.bg} ${prioridadConfig.text}`}>
            {prioridadConfig.icon}
            {prioridadConfig.label}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {ticket.asunto}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded-md font-medium">
            {ticket.categoria}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs">
            Ticket #{ticket.id_ticket}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatFecha(ticket.fecha_creacion)}
          </div>

          <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
            <span className="text-sm font-semibold">Ver detalles</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
