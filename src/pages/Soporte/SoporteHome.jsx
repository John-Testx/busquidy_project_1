import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import TicketList from "@/components/Soporte/TicketList";
import EmailVerification from "@/components/Soporte/EmailVerification";
import { getUserTickets, getTicketsByEmail } from "@/api/supportApi";
import { Plus, Loader2, AlertCircle, Headset, Mail, LogIn } from "lucide-react";

function SoporteHome() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestEmail, setGuestEmail] = useState(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    checkAuthAndLoadTickets();
  }, []);

  const checkAuthAndLoadTickets = async () => {
    // Verificar si está autenticado
    if (token) {
      setIsAuthenticated(true);
      await cargarTicketsAutenticados();
    } else {
      // Verificar si ya ingresó email como invitado
      const savedEmail = sessionStorage.getItem("guest_email");
      if (savedEmail) {
        setGuestEmail(savedEmail);
        await cargarTicketsPublicos(savedEmail);
      } else {
        setShowEmailVerification(true);
        setLoading(false);
      }
    }
  };

  const cargarTicketsAutenticados = async () => {
    try {
      setLoading(true);
      const response = await getUserTickets(token);
      setTickets(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar tickets:", err);
      setError("No se pudieron cargar los tickets. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const cargarTicketsPublicos = async (email) => {
    try {
      setLoading(true);
      const response = await getTicketsByEmail(email);
      setTickets(response.data);
      setError(null);
      setShowEmailVerification(false);
    } catch (err) {
      console.error("Error al cargar tickets públicos:", err);
      setError("No se pudieron cargar los tickets. Verifica tu email.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerified = (email) => {
    setGuestEmail(email);
    cargarTicketsPublicos(email);
  };

  const handleChangeEmail = () => {
    sessionStorage.removeItem("guest_email");
    setGuestEmail(null);
    setShowEmailVerification(true);
    setTickets([]);
  };

  const ticketsFiltrados = tickets.filter(ticket => {
    if (filtro === "todos") return true;
    return ticket.estado === filtro;
  });

  const getEstadisticas = () => {
    return {
      total: tickets.length,
      pendiente: tickets.filter(t => t.estado === "pendiente").length,
      en_proceso: tickets.filter(t => t.estado === "en proceso").length,
      resuelto: tickets.filter(t => t.estado === "resuelto").length,
      cerrado: tickets.filter(t => t.estado === "cerrado").length
    };
  };

  const stats = getEstadisticas();

  const filtros = [
    { value: "todos", label: "Todos", count: stats.total },
    { value: "pendiente", label: "Pendientes", count: stats.pendiente },
    { value: "en proceso", label: "En Proceso", count: stats.en_proceso },
    { value: "resuelto", label: "Resueltos", count: stats.resuelto },
    { value: "cerrado", label: "Cerrados", count: stats.cerrado }
  ];

  // Si debe mostrar verificación de email
  if (showEmailVerification && !isAuthenticated) {
    return <EmailVerification onEmailVerified={handleEmailVerified} />;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <Headset className="w-10 h-10 text-blue-600" />
                  Centro de Soporte
                </h1>
                <p className="text-gray-600">
                  {isAuthenticated 
                    ? "Gestiona tus solicitudes de ayuda y mantente en contacto con nuestro equipo"
                    : `Visualizando tickets de: ${guestEmail}`
                  }
                </p>
              </div>
              
              <div className="flex gap-3">
                {!isAuthenticated && (
                  <>
                    <button
                      onClick={handleChangeEmail}
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                    >
                      <Mail className="w-5 h-5" />
                      Cambiar Email
                    </button>
                  </>
                )}
                <button
                  onClick={() => navigate(isAuthenticated ? "/soporte/crearticket" : "/soporte/crearticket-publico")}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Solicitud
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {filtros.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    filtro === f.value
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-800">{f.count}</div>
                  <div className={`text-sm mt-1 ${
                    filtro === f.value ? "text-blue-600 font-semibold" : "text-gray-600"
                  }`}>
                    {f.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Cargando tus tickets...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => isAuthenticated ? cargarTicketsAutenticados() : cargarTicketsPublicos(guestEmail)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : ticketsFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headset className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {filtro === "todos" 
                    ? "No tienes solicitudes activas" 
                    : `No hay tickets ${filtros.find(f => f.value === filtro)?.label.toLowerCase()}`
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {filtro === "todos"
                    ? "¿Necesitas ayuda? Crea tu primera solicitud de soporte"
                    : "Prueba con otro filtro para ver más tickets"
                  }
                </p>
                {filtro === "todos" && (
                  <button
                    onClick={() => navigate(isAuthenticated ? "/soporte/crearticket" : "/soporte/crearticket-publico")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Crear solicitud
                  </button>
                )}
              </div>
            </div>
          ) : (
            <TicketList 
              tickets={ticketsFiltrados} 
              isPublic={!isAuthenticated}
              guestEmail={guestEmail}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SoporteHome;