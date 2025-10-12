import React, { useState } from "react";
import { useAdminTickets } from "../../api/useAdminTickets";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function SupportTable() {
  const { tickets, loading, error } = useAdminTickets();
  const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    
  // Change ticket state
  const updateEstado = async (id_ticket, estado) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3001/api/support/${id_ticket}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error actualizando estado");

      alert(`Ticket ${id_ticket} actualizado a ${estado}`);
      window.location.reload(); // You can later optimize this by re-fetching only
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Cargando solicitudes de soporte...
      </div>
    );

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Solicitudes de Soporte
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Asunto</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Prioridad</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id_ticket} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{ticket.id_ticket}</td>
                <td className="px-4 py-2">
                  {ticket.nombre_contacto || ticket.nombre_usuario ||
                    ticket.email_usuario ||
                    "Anónimo"}
                </td>
                <td className="px-4 py-2">{ticket.asunto}</td>
                <td className="px-4 py-2">{ticket.categoria}</td>
                <td className="px-4 py-2">{ticket.prioridad}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                <td className="px-4 py-2 space-x-2">
                    <button
                        disabled={updating}
                        onClick={() => updateEstado(ticket.id_ticket, "resuelto")}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                    >
                        Resolver
                    </button>

                    <button
                        disabled={updating}
                        onClick={() => updateEstado(ticket.id_ticket, "cerrado")}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                    >
                        Cerrar
                    </button>

                    <button
                        onClick={() => navigate(`/adminhome/admin/support/${ticket.id_ticket}`)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                    >
                        Ver mensajes
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
