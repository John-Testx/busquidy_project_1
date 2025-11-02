import React from "react";
import { useFormContext } from "react-hook-form";
import { User, Briefcase, Mail, Phone, UserCheck } from 'lucide-react';

export default function StepRepresentante() {
  const { register, formState: { errors } } = useFormContext();

  const fields = [
    { 
      label: "Nombre Completo", 
      name: "representante.nombre_completo",
      icon: User,
      placeholder: "Ej: Juan Pérez García"
    },
    { 
      label: "Cargo", 
      name: "representante.cargo",
      icon: Briefcase,
      placeholder: "Ej: Gerente General, Director Ejecutivo"
    },
    { 
      label: "Correo del Representante", 
      name: "representante.correo_representante",
      icon: Mail,
      type: "email",
      placeholder: "Ej: juan@empresa.com"
    },
    { 
      label: "Teléfono del Representante", 
      name: "representante.telefono_representante",
      icon: Phone,
      placeholder: "Ej: +56 9 1234 5678"
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Información del Representante</h3>
        <p className="text-gray-600 text-sm">Datos del representante legal de la empresa</p>
      </div>

      {/* Avatar Card compacto */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-[#07767c] rounded-xl p-3 flex-shrink-0">
            <UserCheck className="text-white" size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Representante Legal</h4>
            <p className="text-xs text-gray-600">Persona autorizada que representa a la empresa</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.name} className="flex flex-col">
              <label 
                htmlFor={f.name}
                className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"
              >
                <Icon size={16} className="text-[#07767c]" />
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
                className={`px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#07767c] transition-all duration-200 ${
                  errors?.representante?.[f.name.split('.')[1]]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {errors?.representante?.[f.name.split('.')[1]] && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.representante[f.name.split('.')[1]].message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Info Box compacto */}
      <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-700 flex items-start gap-2">
          <span className="text-base">🔒</span>
          <span>Estos datos serán utilizados solo para fines de contacto y verificación legal de tu empresa</span>
        </p>
      </div>
    </div>
  );
}