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

function StepInclusionLaboral({ freelancerData, handleChange, handleSelectChange }) {
  const siNoOptions = [
    { value: "Si", label: "Sí" },
    { value: "No", label: "No" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-teal-200">
        Inclusión Laboral
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Posee alguna discapacidad? <span className="text-red-500">*</span>
        </label>
        <Select
          options={siNoOptions}
          placeholder="Selecciona una opción"
          onChange={(option) => handleSelectChange(option, "inclusion_laboral", "discapacidad")}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customSelectStyles}
        />
      </div>

      {freelancerData.inclusion_laboral.discapacidad === "Si" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Discapacidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="tipo_discapacidad"
              placeholder="Especifica el tipo de discapacidad"
              value={freelancerData.inclusion_laboral.tipo_discapacidad}
              onChange={(e) => handleChange(e, "inclusion_laboral")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Está registrado en el Registro Nacional?
            </label>
            <Select
              options={[...siNoOptions, { value: "En trámite", label: "En trámite" }]}
              placeholder="Selecciona una opción"
              onChange={(option) => handleSelectChange(option, "inclusion_laboral", "registro_nacional")}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Recibe pensión de invalidez?
            </label>
            <Select
              options={[...siNoOptions, { value: "En trámite", label: "En trámite" }]}
              placeholder="Selecciona una opción"
              onChange={(option) => handleSelectChange(option, "inclusion_laboral", "pension_invalidez")}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Requiere algún ajuste para la entrevista?
            </label>
            <textarea
              name="ajuste_entrevista"
              rows={3}
              placeholder="Describe los ajustes que necesitas..."
              value={freelancerData.inclusion_laboral.ajuste_entrevista}
              onChange={(e) => handleChange(e, "inclusion_laboral")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default StepInclusionLaboral;