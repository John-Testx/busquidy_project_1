import React from "react";
import { useFormContext } from "react-hook-form";

export default function StepRepresentante() {
  const { register, formState: { errors } } = useFormContext();

  const fields = [
    { 
      label: "Nombre Completo", 
      name: "representante.nombre_completo",
      icon: "fa-user",
      placeholder: "Ej: Juan Pérez García"
    },
    { 
      label: "Cargo", 
      name: "representante.cargo",
      icon: "fa-briefcase",
      placeholder: "Ej: Gerente General, Director Ejecutivo"
    },
    { 
      label: "Correo del Representante", 
      name: "representante.correo_representante",
      icon: "fa-envelope",
      type: "email",
      placeholder: "Ej: juan@empresa.com"
    },
    { 
      label: "Teléfono del Representante", 
      name: "representante.telefono_representante",
      icon: "fa-phone",
      placeholder: "Ej: +56 9 1234 5678"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información del Representante</h2>
        <p className="text-gray-600">Datos de contacto del representante legal de la empresa</p>
      </div>

      {/* Avatar and Role Card */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-teal-600 rounded-full p-4 flex-shrink-0">
            <i className="fas fa-user-tie text-white text-2xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Representante Legal</h3>
            <p className="text-sm text-gray-600">Persona autorizada que representa a la empresa</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(f => (
          <div key={f.name} className="flex flex-col">
            <label 
              htmlFor={f.name}
              className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
            >
              <i className={`fas ${f.icon} text-teal-600 w-4`}></i>
              {f.label}
              <span className="text-red-500">*</span>
            </label>
            <input
              id={f.name}
              type={f.type || "text"}
              placeholder={f.placeholder}
              {...register(f.name, { 
                required: "Este campo es obligatorio",
                ...(f.type === "email" && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo inválido"
                  }
                })
              })}
              className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 ${
                errors[f.name]
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
            />
            {errors[f.name] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <i className="fas fa-exclamation-circle"></i>
                {errors[f.name].message}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Security Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700 flex items-start gap-2">
          <i className="fas fa-shield-alt mt-0.5 flex-shrink-0"></i>
          <span>Estos datos serán utilizados solo para fines de contacto y verificación legal de tu empresa</span>
        </p>
      </div>
    </div>
  );
}