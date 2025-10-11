import React, { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const categorias = [
  { value: "Cuenta", icon: "👤", descripcion: "Problemas con tu cuenta de usuario" },
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

function TicketForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    asunto: "",
    categoria: "Otro",
    prioridad: "media",
    mensaje: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.asunto.trim()) {
      newErrors.asunto = "El asunto es requerido";
    } else if (form.asunto.length < 10) {
      newErrors.asunto = "El asunto debe tener al menos 10 caracteres";
    }

    if (!form.mensaje.trim()) {
      newErrors.mensaje = "La descripción es requerida";
    } else if (form.mensaje.length < 20) {
      newErrors.mensaje = "La descripción debe tener al menos 20 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="Ej: No puedo acceder a mi proyecto"
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
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          placeholder="Describe tu problema con el mayor detalle posible..."
          rows="6"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
            errors.mensaje
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
          disabled={isSubmitting}
        />
        {errors.mensaje && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.mensaje}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {form.mensaje.length} caracteres (mínimo 20)
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
  );
}

export default TicketForm;