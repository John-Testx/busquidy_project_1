import React, { useState } from "react";
import { useAdminTickets } from "@/hooks";
import { updateTicketStatus } from "@/api/supportApi";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock,
  AlertTriangle,
  Mail,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen"; // ← NUEVO: Importar LoadingScreen

export default function SupportTable() {
  const { tickets, loading, error } = useAdminTickets();
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(""); // ← NUEVO: Mensaje personalizado
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterPrioridad, setFilterPrioridad] = useState("todos");
  const navigate = useNavigate();

  const updateEstado = async (id_ticket, estado) => {
    try {
      setUpdating(true);
      // ← NUEVO: Mensaje personalizado según la acción
      const mensajes = {
        'resuelto': 'Marcando ticket como resuelto...',
        'cerrado': 'Cerrando ticket...',
        'en proceso': 'Actualizando estado del ticket...',
        'pendiente': 'Actualizando estado del ticket...'
      };
      setUpdateMessage(mensajes[estado] || 'Actualizando ticket...');
      
      await updateTicketStatus(id_ticket, estado);
      
      // ← NUEVO: Mensaje de éxito antes de recargar
      setUpdateMessage('¡Actualización exitosa! Recargando...');
      
      // Pequeño delay para mostrar el mensaje de éxito
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      setUpdating(false);
      alert(err.message || "Error actualizando estado");
    }
  };

  // ← NUEVO: Función para manejar recarga manual
  const handleRefresh = () => {
    setUpdating(true);
    setUpdateMessage('Recargando tickets...');
    window.location.reload();
  };

  // Función para obtener el correo del usuario
  const getUserEmail = (ticket) => {
    return ticket.email_contacto || ticket.email_usuario || "Sin correo";
  };

  // Filtrar tickets
  const ticketsFiltrados = tickets.filter(ticket => {
    const userEmail = getUserEmail(ticket);
    const matchSearch = 
      ticket.asunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id_ticket?.toString().includes(searchTerm);
    
    const matchEstado = filterEstado === "todos" || ticket.estado === filterEstado;
    const matchPrioridad = filterPrioridad === "todos" || ticket.prioridad === filterPrioridad;
    return matchSearch && matchEstado && matchPrioridad;
  });

  // Estadísticas
  const stats = {
    total: tickets.length,
    pendiente: tickets.filter(t => t.estado === "pendiente").length,
    enProceso: tickets.filter(t => t.estado === "en proceso").length,
    resuelto: tickets.filter(t => t.estado === "resuelto").length,
    cerrado: tickets.filter(t => t.estado === "cerrado").length,
  };

  const getPrioridadIcon = (prioridad) => {
    return <AlertTriangle className={`w-3 h-3 md:w-4 md:h-4 ${
      prioridad === 'alta' ? 'text-red-600' :
      prioridad === 'media' ? 'text-yellow-600' :
      'text-green-600'
    }`} />;
  };

  const getEstadoConfig = (estado) => {
    const configs = {
      pendiente: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <Clock className="w-3 h-3 md:w-4 md:h-4" />
      },
      "en proceso": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
      },
      resuelto: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
      },
      cerrado: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: <XCircle className="w-3 h-3 md:w-4 md:h-4" />
      }
    };
    return configs[estado] || configs.pendiente;
  };

  // ← NUEVO: Mostrar LoadingScreen cuando está actualizando o cargando inicialmente
  if (updating) {
    return <LoadingScreen message={updateMessage} />;
  }

  if (loading) {
    return <LoadingScreen message="Cargando solicitudes de soporte..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg">
        <p className="text-red-700 font-medium text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Total</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Pendientes</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pendiente}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">En Proceso</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.enProceso}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Resueltos</p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.resuelto}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-gray-400">
          <p className="text-xs md:text-sm text-gray-600 font-medium">Cerrados</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-600">{stats.cerrado}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por ID, asunto o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm"
              />
            </div>
          </div>
          {/* Filtro Estado */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
          {/* Filtro Prioridad */}
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value)}
              className="pl-9 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c] focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
            >
              <option value="todos">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          {/* Botón Recargar */}
          <button
            onClick={handleRefresh} // ← CAMBIADO: Usar nueva función
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Recargar</span>
          </button>
        </div>
        {/* Resultados */}
        <p className="mt-3 text-sm text-gray-600">
          Mostrando <span className="font-semibold">{ticketsFiltrados.length}</span> de <span className="font-semibold">{tickets.length}</span> tickets
        </p>
      </div>

      {/* Tabla / Cards */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#07767c] to-[#055a5f]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Asunto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ticketsFiltrados.map((ticket, index) => {
                const estadoConfig = getEstadoConfig(ticket.estado);
                const userEmail = getUserEmail(ticket);
                
                return (
                  <tr
                    key={ticket.id_ticket}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-[#07767c]/5 transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#07767c]">
                        #{ticket.id_ticket}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 truncate max-w-[200px]" title={userEmail}>
                          {userEmail}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span className="text-sm text-gray-900 line-clamp-2">
                        {ticket.asunto}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {ticket.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          ticket.prioridad === "alta"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : ticket.prioridad === "media"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {getPrioridadIcon(ticket.prioridad)}
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${estadoConfig.bg} ${estadoConfig.text} ${estadoConfig.border}`}
                      >
                        {estadoConfig.icon}
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={updating}
                          onClick={() =>
                            updateEstado(ticket.id_ticket, "resuelto")
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-sm hover:shadow-md"
                          title="Resolver"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          disabled={updating}
                          onClick={() =>
                            updateEstado(ticket.id_ticket, "cerrado")
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-sm hover:shadow-md"
                          title="Cerrar"
                        >
                          <XCircle size={14} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/adminhome/admin/support/${ticket.id_ticket}`
                            )
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors text-xs font-medium shadow-sm hover:shadow-md"
                          title="Ver mensajes"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {ticketsFiltrados.map((ticket) => {
            const estadoConfig = getEstadoConfig(ticket.estado);
            const userEmail = getUserEmail(ticket);
            
            return (
              <div
                key={ticket.id_ticket}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-lg font-bold text-[#07767c]">
                    #{ticket.id_ticket}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${estadoConfig.bg} ${estadoConfig.text} ${estadoConfig.border}`}
                  >
                    {estadoConfig.icon}
                    {ticket.estado}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {ticket.asunto}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {ticket.categoria}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                      ticket.prioridad === "alta"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : ticket.prioridad === "media"
                        ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {getPrioridadIcon(ticket.prioridad)}
                    {ticket.prioridad}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{userEmail}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={updating}
                    onClick={() => updateEstado(ticket.id_ticket, "resuelto")}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-xs font-medium"
                  >
                    <CheckCircle size={14} />
                    Resolver
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => updateEstado(ticket.id_ticket, "cerrado")}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-xs font-medium"
                  >
                    <XCircle size={14} />
                    Cerrar
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/adminhome/admin/support/${ticket.id_ticket}`)
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] text-xs font-medium"
                  >
                    <MessageSquare size={14} />
                    Ver
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {ticketsFiltrados.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No se encontraron tickets
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}