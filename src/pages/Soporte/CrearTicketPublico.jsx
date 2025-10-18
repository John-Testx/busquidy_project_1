import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { createPublicTicket } from "@/api/supportApi";
import { ArrowLeft, CheckCircle, AlertCircle, User, Mail as MailIcon } from "lucide-react";

const categorias = [
  { value: "Cuenta", icon: "👤", descripcion: "Problemas con acceso o recuperación de cuenta" },
  { value: "Pago", icon: "💳", descripcion: "Consultas sobre pagos y facturación" },
  { value: "Proyecto", icon: "📁", descripcion: "Ayuda con proyectos específicos" },
  { value: "Suscripción", icon: "⭐", descripcion: "Gestión de tu suscripción" },
  { value: "Técnico", icon: "🔧", descripcion: "Problemas técnicos de la plataforma" },
  { value: "Otro", icon: "📝", descripcion: "Otras consultas" }
];

const prioridades = [
  { value: "baja", label: "Baja", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "media", label: "Media", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "alta", label: "Alta", color: "bg-red-100 text-red-800 border-red-300" }
];

function CrearTicketPublico() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);

  const [form, setForm] = useState({
    nombre_contacto: "",
    email_contacto: "",
    asunto: "",
    categoria: "Otro",
    prioridad: "media",
    mensaje_inicial: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre_contacto.trim()) {
      newErrors.nombre_contacto = "El nombre es requerido";
    }

    if (!form.email_contacto.trim()) {
      newErrors.email_contacto = "El email es requerido";
    } else if (!form.email_contacto.includes("@")) {
      newErrors.email_contacto = "Email inválido";
    }

    if (!form.asunto.trim()) {
      newErrors.asunto = "El asunto es requerido";
    } else if (form.asunto.length < 10) {
      newErrors.asunto = "El asunto debe tener al menos 10 caracteres";
    }

    if (!form.mensaje_inicial.trim()) {
      newErrors.mensaje_inicial = "La descripción es requerida";
    } else if (form.mensaje_inicial.length < 20) {
      newErrors.mensaje_inicial = "La descripción debe tener al menos 20 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createPublicTicket(form);
      
      // Guardar email en sessionStorage para futuras consultas
      sessionStorage.setItem("guest_email", form.email_contacto);
      
      setTicketInfo({
        id_ticket: response.data.id_ticket,
        codigo_seguimiento: response.data.codigo_seguimiento
      });
      setSuccess(true);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate(`/soporte/ticket-publico/${response.data.id_ticket}?email=${form.email_contacto}`);
      }, 3000);
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Ticket ID:</p>
              <p className="text-2xl font-bold text-blue-600">
                #{ticketInfo?.id_ticket}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Código: {ticketInfo?.codigo_seguimiento}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Te hemos enviado un email de confirmación a:<br />
              <strong>{form.email_contacto}</strong>
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
                Crear Solicitud de Soporte
              </h1>
              <p className="text-blue-100">
                Completa el formulario y nuestro equipo te responderá lo antes posible
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de contacto */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre_contacto"
                    value={form.nombre_contacto}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.nombre_contacto
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.nombre_contacto && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nombre_contacto}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MailIcon className="w-4 h-4" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email_contacto"
                    value={form.email_contacto}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.email_contacto
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email_contacto && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email_contacto}
                    </p>
                  )}
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={form.asunto}
                  onChange={handleChange}
                  placeholder="Ej: No puedo recuperar mi contraseña"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.asunto
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.asunto && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.asunto}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Categoría *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categorias.map((cat) => (
                    <label
                      key={cat.value}
                      className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                        form.categoria === cat.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="categoria"
                        value={cat.value}
                        checked={form.categoria === cat.value}
                        onChange={handleChange}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-semibold text-gray-800">{cat.value}</span>
                      </div>
                      <span className="text-xs text-gray-500">{cat.descripcion}</span>
                      {form.categoria === cat.value && (
                        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Prioridad *
                </label>
                <div className="flex gap-3">
                  {prioridades.map((prior) => (
                    <label
                      key={prior.value}
                      className={`flex-1 flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                        form.prioridad === prior.value
                          ? `${prior.color} border-current shadow-md`
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="prioridad"
                        value={prior.value}
                        checked={form.prioridad === prior.value}
                        onChange={handleChange}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <span className="font-semibold">{prior.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción del problema *
                </label>
                <textarea
                  name="mensaje_inicial"
                  value={form.mensaje_inicial}
                  onChange={handleChange}
                  placeholder="Describe tu problema con el mayor detalle posible..."
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.mensaje_inicial
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.mensaje_inicial && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.mensaje_inicial}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {form.mensaje_inicial.length} caracteres (mínimo 20)
                </p>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creando solicitud...
                  </span>
                ) : (
                  "Enviar solicitud"
                )}
              </button>
            </form>
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
                <span>Guarda el número de ticket para futuras consultas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Revisa tu email para recibir actualizaciones del ticket</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Tiempo promedio de respuesta: 2-4 horas en horario laboral</span>
              </li>
            </ul>
          </div>

          <div className="max-w-3xl mx-auto mt-6 bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-3">
              ¿Ya tienes una cuenta?
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Inicia sesión aquí
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CrearTicketPublico;