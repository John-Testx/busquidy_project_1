import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const optionsTipoContratacion = [
  { value: "porProyecto", label: "Por proyecto" },
  { value: "porHora", label: "Por hora" },
  { value: "largoPlazo", label: "A largo plazo" },
];

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#07767c' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(7, 118, 124, 0.1)' : 'none',
    '&:hover': {
      borderColor: '#07767c',
    },
    borderRadius: '0.5rem',
    padding: '0.25rem',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#07767c' : state.isFocused ? '#07767c15' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:active': {
      backgroundColor: '#07767c',
    },
  }),
};

export default function StepProjectAdditional({ control }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#07767c]/20">
          Información Adicional
        </h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Ubicación del Proyecto
        </label>
        <Controller
          name="ubicacion"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Ej: Remoto, Santiago, Valparaíso"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors"
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">Especifica si es remoto o la ubicación física</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Tipo de Contratación <span className="text-red-500">*</span>
        </label>
        <Controller
          name="tipo_contratacion"
          control={control}
          rules={{ required: "Selecciona un tipo de contratación" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                options={optionsTipoContratacion}
                value={optionsTipoContratacion.find(option => option.value === field.value) || null}
                onChange={(option) => field.onChange(option.value)}
                placeholder="Selecciona el tipo de contratación"
                styles={customSelectStyles}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Metodología de Trabajo
        </label>
        <Controller
          name="metodologia_trabajo"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Ej: Agile, Scrum, Kanban, Waterfall"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors"
            />
          )}
        />
        <p className="text-xs text-gray-500 mt-1">Opcional: Metodología preferida para el proyecto</p>
      </div>

      <div className="bg-[#07767c]/5 border border-[#07767c]/20 rounded-lg p-4 mt-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-[#07767c] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Revisa toda la información antes de crear</p>
            <p className="text-xs text-gray-600 mt-1">Asegúrate de que todos los detalles sean correctos. Podrás editar el proyecto después de crearlo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}