import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import TicketForm from "@/components/Soporte/TicketForm";
import { createTicket } from "@/api/supportApi";
import { ArrowLeft, CheckCircle } from "lucide-react";

function CrearTicket() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketCreado, setTicketCreado] = useState(null);

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Crear el ticket
      const response = await createTicket(
        {
          asunto: formData.asunto,
          categoria: formData.categoria,
          prioridad: formData.prioridad
        },
        token
      );

      const idTicket = response.data.id_ticket;
      setTicketCreado(idTicket);

      // Mostrar mensaje de éxito
      setSuccess(true);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(`/soporte/ticket/${idTicket}`);
      }, 2000);
    } catch (error) {
      console.error("Error al crear ticket:", error);
      alert(
        error.response?.data?.error || 
        "Error al crear la solicitud. Por favor, intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 pt-20">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              ¡Solicitud Creada!
            </h2>
            <p className="text-gray-600 mb-2">
              Tu ticket ha sido creado exitosamente
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Ticket #{ticketCreado}
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Redirigiendo al ticket...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/soporte")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al centro de soporte
            </button>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                Crear Nueva Solicitud
              </h1>
              <p className="text-blue-100">
                Completa el formulario y nuestro equipo te responderá lo antes posible
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <TicketForm 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Información adicional */}
          <div className="max-w-3xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              💡 Consejos para una mejor atención
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Sé lo más específico posible al describir tu problema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Incluye capturas de pantalla si es posible (puedes agregarlas en el chat)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Menciona los pasos que seguiste antes de encontrar el problema</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Tiempo promedio de respuesta: 2-4 horas en horario laboral</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CrearTicket;