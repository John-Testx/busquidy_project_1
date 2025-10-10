import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const optionsCategoria = [
  { value: "Desarrollo Web", label: "Desarrollo Web" },
  { value: "Diseño Gráfico", label: "Diseño Gráfico" },
  { value: "Marketing Digital", label: "Marketing Digital" },
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

export default function StepProjectInfo({ control }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-[#07767c]/20">
          Información del Proyecto
        </h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Título del Proyecto <span className="text-red-500">*</span>
        </label>
        <Controller
          name="titulo"
          control={control}
          rules={{ required: "El título es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                placeholder="Ej: Desarrollo de sitio web corporativo"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Descripción <span className="text-red-500">*</span>
        </label>
        <Controller
          name="descripcion"
          control={control}
          rules={{ required: "La descripción es obligatoria" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <textarea
                {...field}
                placeholder="Describe detalladamente los objetivos y alcance del proyecto..."
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07767c]/20 focus:border-[#07767c] transition-colors resize-none ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Categoría <span className="text-red-500">*</span>
        </label>
        <Controller
          name="categoria"
          control={control}
          rules={{ required: "Selecciona una categoría" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                options={optionsCategoria}
                value={optionsCategoria.find(option => option.value === field.value) || null}
                onChange={(option) => field.onChange(option.value)}
                placeholder="Selecciona una categoría"
                styles={customSelectStyles}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
}