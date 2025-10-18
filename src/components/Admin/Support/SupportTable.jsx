import React, { useState } from "react";
import { useAdminTickets } from "@/hooks/useAdminTickets";
import { updateTicketStatus } from "@/api/supportApi";
import { Loader2, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupportTable() {
  const { tickets, loading, error } = useAdminTickets();
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const updateEstado = async (id_ticket, estado) => {
    try {
      setUpdating(true);
      await updateTicketStatus(id_ticket, estado);
      alert(`Ticket ${id_ticket} actualizado a ${estado}`);
      window.location.reload();
    } catch (err) {
      alert(err.message || "Error actualizando estado");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2 text-[#07767c]" size={32} />
        <span className="text-lg">Cargando solicitudes de soporte...</span>
      </div>
    );

  if (error) 
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#07767c] to-[#055a5f] px-6 py-4">
        <h2 className="text-2xl font-bold text-white">
          Solicitudes de Soporte
        </h2>
        <p className="text-white/80 text-sm mt-1">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Asunto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket, index) => (
              <tr 
                key={ticket.id_ticket} 
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-[#07767c]/5 transition-colors duration-150`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    #{ticket.id_ticket}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {ticket.nombre_contacto || ticket.nombre_usuario ||
                      ticket.email_usuario ||
                      "Anónimo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900 line-clamp-2">
                    {ticket.asunto}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {ticket.categoria}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                    ticket.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.prioridad}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      ticket.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : ticket.estado === "en proceso"
                        ? "bg-blue-100 text-blue-700"
                        : ticket.estado === "resuelto"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={updating}
                      onClick={() => updateEstado(ticket.id_ticket, "resuelto")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-sm"
                      title="Resolver"
                    >
                      <CheckCircle size={14} />
                      <span>Resolver</span>
                    </button>

                    <button
                      disabled={updating}
                      onClick={() => updateEstado(ticket.id_ticket, "cerrado")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium shadow-sm"
                      title="Cerrar"
                    >
                      <XCircle size={14} />
                      <span>Cerrar</span>
                    </button>

                    <button
                      onClick={() => navigate(`/adminhome/admin/support/${ticket.id_ticket}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#07767c] text-white rounded-lg hover:bg-[#055a5f] transition-colors text-xs font-medium shadow-sm"
                      title="Ver mensajes"
                    >
                      <MessageSquare size={14} />
                      <span>Ver</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay tickets de soporte</p>
        </div>
      )}
    </div>
  );
}