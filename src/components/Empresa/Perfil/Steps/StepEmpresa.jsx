import React from "react";
import { useFormContext } from "react-hook-form";

export default function StepEmpresa() {
  const { register, formState: { errors } } = useFormContext();

  const fields = [
    { 
      label: "Nombre de la Empresa", 
      name: "empresa.nombre_empresa",
      icon: "fa-building",
      placeholder: "Ej: Tech Solutions S.A."
    },
    { 
      label: "Identificación Fiscal", 
      name: "empresa.identificacion_fiscal",
      icon: "fa-id-card",
      placeholder: "Ej: 12.345.678-9"
    },
    { 
      label: "Dirección", 
      name: "empresa.direccion",
      icon: "fa-map-marker-alt",
      placeholder: "Ej: Calle Principal 123, Santiago"
    },
    { 
      label: "Teléfono de contacto", 
      name: "empresa.telefono_contacto",
      icon: "fa-phone",
      placeholder: "Ej: +56 9 1234 5678"
    },
    { 
      label: "Correo de la empresa", 
      name: "empresa.correo_empresa",
      icon: "fa-envelope",
      type: "email",
      placeholder: "Ej: contacto@empresa.com"
    },
    { 
      label: "Página web", 
      name: "empresa.pagina_web",
      icon: "fa-globe",
      type: "url",
      placeholder: "Ej: https://www.empresa.com"
    },
    { 
      label: "Sector industrial", 
      name: "empresa.sector_industrial",
      icon: "fa-industry",
      placeholder: "Ej: Tecnología, Consultoría, etc."
    },
  ];

  const textareaFields = [
    { 
      label: "Descripción de la empresa", 
      name: "empresa.descripcion",
      icon: "fa-pen-fancy",
      placeholder: "Cuéntanos sobre tu empresa, su misión y valores...",
      rows: 5
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de la Empresa</h2>
        <p className="text-gray-600">Completa los datos básicos de tu empresa</p>
      </div>

      {/* Input Fields */}
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
              {...register(f.name, { required: "Este campo es obligatorio" })}
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

      {/* Textarea Field */}
      <div className="flex flex-col">
        <label 
          htmlFor={textareaFields[0].name}
          className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
        >
          <i className={`fas ${textareaFields[0].icon} text-teal-600 w-4`}></i>
          {textareaFields[0].label}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id={textareaFields[0].name}
          placeholder={textareaFields[0].placeholder}
          rows={textareaFields[0].rows}
          {...register(textareaFields[0].name, { required: "Este campo es obligatorio" })}
          className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 resize-none ${
            errors[textareaFields[0].name]
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white'
          }`}
        />
        {errors[textareaFields[0].name] && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <i className="fas fa-exclamation-circle"></i>
            {errors[textareaFields[0].name].message}
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-4">
        <p className="text-sm text-teal-700 flex items-center gap-2">
          <i className="fas fa-info-circle"></i>
          <span>Asegúrate de que toda la información sea precisa y esté actualizada</span>
        </p>
      </div>
    </div>
  );
}