import React from "react";
import Select from "react-select";

const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderColor: '#d1d5db',
    '&:hover': { borderColor: '#14b8a6' },
    boxShadow: 'none',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#14b8a6' : state.isFocused ? '#ccfbf1' : 'white',
    color: state.isSelected ? 'white' : '#374151',
  }),
};

function StepNivelEducacional({ handleSelectChange }) {
  const nivelesOptions = [
    { value: "Basica", label: "Básica" },
    { value: "Media", label: "Media" },
    { value: "Universidad", label: "Universidad" },
    { value: "Postgrado", label: "Postgrado" },
    { value: "Doctorado", label: "Doctorado" },
  ];

  const estadoOptions = [
    { value: "Completa", label: "Completa" },
    { value: "Incompleta", label: "Incompleta" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Nivel Educacional
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel Académico <span className="text-red-500">*</span>
        </label>
        <Select
          options={nivelesOptions}
          placeholder="Selecciona tu nivel académico"
          onChange={(option) => handleSelectChange(option, "nivel_educacional", "nivel_academico")}
          className="react-select-container"
          classNamePrefix="react-select"
          menuPortalTarget={document.body}
          styles={{
            ...customSelectStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 })
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado <span className="text-red-500">*</span>
        </label>
        <Select
          options={estadoOptions}
          placeholder="Selecciona el estado"
          onChange={(option) => handleSelectChange(option, "nivel_educacional", "estado_educacional")}
          className="react-select-container"
          classNamePrefix="react-select"
          menuPortalTarget={document.body}
          styles={{
            ...customSelectStyles,
            menuPortal: (base) => ({ ...base, zIndex: 9999 })
          }}
        />
      </div>
    </div>
  );
}

export default StepNivelEducacional;