import React from "react";
import { useFormContext } from "react-hook-form";
import { Building2, CreditCard, MapPin, Phone, Mail, Globe, Factory, FileText } from 'lucide-react';

export default function StepEmpresa() {
  const { register, formState: { errors } } = useFormContext();

  const fields = [
    { 
      label: "Nombre de la Empresa", 
      name: "empresa.nombre_empresa",
      icon: Building2,
      placeholder: "Ej: Tech Solutions S.A."
    },
    { 
      label: "Identificación Fiscal", 
      name: "empresa.identificacion_fiscal",
      icon: CreditCard,
      placeholder: "Ej: 12.345.678-9"
    },
    { 
      label: "Dirección", 
      name: "empresa.direccion",
      icon: MapPin,
      placeholder: "Ej: Calle Principal 123, Santiago"
    },
    { 
      label: "Teléfono de contacto", 
      name: "empresa.telefono_contacto",
      icon: Phone,
      placeholder: "Ej: +56 9 1234 5678"
    },
    { 
      label: "Correo de la empresa", 
      name: "empresa.correo_empresa",
      icon: Mail,
      type: "email",
      placeholder: "Ej: contacto@empresa.com"
    },
    { 
      label: "Página web", 
      name: "empresa.pagina_web",
      icon: Globe,
      type: "url",
      placeholder: "Ej: https://www.empresa.com"
    },
    { 
      label: "Sector industrial", 
      name: "empresa.sector_industrial",
      icon: Factory,
      placeholder: "Ej: Tecnología, Consultoría, etc."
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Información de la Empresa</h3>
        <p className="text-gray-600 text-sm">Completa los datos básicos de tu organización</p>
      </div>

      {/* Input Fields en grid más compacto */}
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
                {...register(f.name, { required: "Este campo es obligatorio" })}
                className={`px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#07767c] transition-all duration-200 ${
                  errors?.empresa?.[f.name.split('.')[1]]
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {errors?.empresa?.[f.name.split('.')[1]] && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.empresa[f.name.split('.')[1]].message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Textarea Field */}
      <div className="flex flex-col">
        <label 
          htmlFor="empresa.descripcion"
          className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"
        >
          <FileText size={16} className="text-[#07767c]" />
          Descripción de la empresa
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="empresa.descripcion"
          placeholder="Cuéntanos sobre tu empresa, su misión y valores..."
          rows={4}
          {...register("empresa.descripcion", { required: "Este campo es obligatorio" })}
          className={`px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#07767c] transition-all duration-200 resize-none ${
            errors?.empresa?.descripcion
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white'
          }`}
        />
        {errors?.empresa?.descripcion && (
          <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {errors.empresa.descripcion.message}
          </p>
        )}
      </div>
    </div>
  );
}